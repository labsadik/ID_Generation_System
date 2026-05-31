const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const qr = require('qr-image');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/User');

// --- SECURITY & CONFIGURATION ---

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) return cb(null, true);
    cb(new Error('Error: Images and PDFs only!'));
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, Date.now() + '-' + safeName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 },
    fileFilter: fileFilter
});

// --- HELPERS ---

const generateUID = async () => {
    let uid;
    let exists = true;
    while (exists) {
        const p1 = Math.floor(1000 + Math.random() * 9000);
        const p2 = Math.floor(1000 + Math.random() * 9000);
        const p3 = Math.floor(1000 + Math.random() * 9000);
        uid = `${p1} ${p2} ${p3}`;
        exists = await User.findOne({ uid });
    }
    return uid;
};

const escapeRegex = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// --- ROUTES ---

// 1. Register User
router.post('/register', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'extraDoc', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, number, fatherName, motherName, age, gender, state, city, district, pinCode, fullAddress } = req.body;
        if (!name || !number || !fatherName || !gender || !age) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const uid = await generateUID();
        const newUser = new User({
            uid, name, number, fatherName, motherName, age, gender,
            address: { state, city, district, pinCode, fullAddress },
            photoPath: req.files['photo'] ? req.files['photo'][0].filename : '',
            signaturePath: req.files['signature'] ? req.files['signature'][0].filename : '',
            extraDocPath: req.files['extraDoc'] ? req.files['extraDoc'][0].filename : ''
        });
        await newUser.save();
        res.json({ success: true, uid: newUser.uid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// 2. Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 }).select('name uid gender age photoPath createdAt');
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const userList = users.map(u => ({
            _id: u._id, uid: u.uid, name: u.name, gender: u.gender, age: u.age, createdAt: u.createdAt,
            photoUrl: u.photoPath ? `${baseUrl}/uploads/${u.photoPath}` : null
        }));
        res.json(userList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// 3. Search User (Updated to include extraDocUrl)
router.get('/user/:uid', async (req, res) => {
    try {
        const uidRaw = req.params.uid.replace(/\s/g, '');
        if (uidRaw.length !== 12) return res.status(400).json({ message: 'Invalid UID format' });
        const safeUid = escapeRegex(uidRaw);
        const regex = new RegExp(`^${safeUid.slice(0,4)}\\s?${safeUid.slice(4,8)}\\s?${safeUid.slice(8,12)}$`);
        const user = await User.findOne({ uid: { $regex: regex } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.json({
            ...user._doc,
            photoUrl: user.photoPath ? `${baseUrl}/uploads/${user.photoPath}` : null,
            signatureUrl: user.signaturePath ? `${baseUrl}/uploads/${user.signaturePath}` : null,
            // ADDED: URL for the extra document (PDF/Image)
            extraDocUrl: user.extraDocPath ? `${baseUrl}/uploads/${user.extraDocPath}` : null
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// 4. Download PDF (School ID Card Design)
router.get('/download/:uid', async (req, res) => {
    try {
        const uidRaw = req.params.uid.replace(/\s/g, '');
        if (uidRaw.length !== 12) return res.status(400).json({ message: 'Invalid UID' });

        const safeUid = escapeRegex(uidRaw);
        const regex = new RegExp(`^${safeUid.slice(0,4)}\\s?${safeUid.slice(4,8)}\\s?${safeUid.slice(8,12)}$`);
        
        const user = await User.findOne({ uid: { $regex: regex } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const doc = new PDFDocument({ size: 'A4', margin: 0 });
        const filename = `School_ID_${user.uid.replace(/\s/g, '')}.pdf`;
        
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        // --- DESIGN CONSTANTS ---
        const yellow = '#FFC107';
        const black = '#000000';
        const white = '#FFFFFF';
        
        // Card Dimensions (Side by Side)
        const cardW = 240;
        const cardH = 160;
        const gap = 20;
        
        // Center positions
        const totalWidth = (cardW * 2) + gap;
        const startX = (595 - totalWidth) / 2; 
        const startY = 200;

        const frontX = startX;
        const backX = startX + cardW + gap;

        // Generate QR First
        const verifyUrl = `${process.env.CLIENT_URL}/verify/${user.uid.replace(/\s/g, '')}`;
        const qr_img = qr.image(verifyUrl, { type: 'png', size: 3, margin: 0 });
        const qrPath = path.join(__dirname, '../uploads/qr_temp.png');
        await new Promise((resolve, reject) => {
            qr_img.pipe(fs.createWriteStream(qrPath)).on('finish', resolve).on('error', reject);
        });

        // ================== FRONT CARD (Student Details) ==================
        
        // 1. Border (Black)
        doc.rect(frontX, startY, cardW, cardH).fill(white).stroke(black).lineWidth(2);

        // 2. Header (Yellow)
        doc.rect(frontX, startY, cardW, 25).fill(yellow);
        doc.fillColor(black).fontSize(11).font('Helvetica-Bold')
           .text('STUDENT ID CARD', frontX, startY + 6, { width: cardW, align: 'center' });

        // 3. Photo (Top Left)
        const photoX = frontX + 10;
        const photoY = startY + 35;
        const photoW = 60;
        const photoH = 70;

        if (user.photoPath) {
            doc.image(path.join(__dirname, '../uploads', user.photoPath), photoX, photoY, { width: photoW, height: photoH });
        }
        // Photo border
        doc.rect(photoX, photoY, photoW, photoH).stroke(black).lineWidth(1);

        // 4. Details (Right of Photo)
        doc.fillColor(black).fontSize(9);
        let textX = photoX + photoW + 10;
        let textY = photoY;
        const lineH = 14;

        // Name
        doc.font('Helvetica-Bold').text('Name:', textX, textY);
        doc.font('Helvetica').text(user.name, textX + 35, textY, { width: 120 });
        textY += lineH;

        // Father
        doc.font('Helvetica-Bold').text('Father:', textX, textY);
        doc.font('Helvetica').text(user.fatherName, textX + 35, textY, { width: 120 });
        textY += lineH;

        // Gender
        doc.font('Helvetica-Bold').text('Gender:', textX, textY);
        doc.font('Helvetica').text(user.gender, textX + 35, textY);
        textY += lineH;

        // Age
        doc.font('Helvetica-Bold').text('Age:', textX, textY);
        doc.font('Helvetica').text(user.age.toString(), textX + 35, textY);

        // 5. UID (Below Details)
        doc.font('Helvetica-Bold').fontSize(12).fillColor(black);
        doc.text(user.uid, frontX + 10, startY + cardH - 35, { width: cardW - 20, align: 'center' });

        // 6. Signature (Bottom Right with Label)
        const sigX = frontX + cardW - 60;
        const sigY = startY + cardH - 45;
        
        if (user.signaturePath) {
            doc.image(path.join(__dirname, '../uploads', user.signaturePath), sigX, sigY, { fit: [50, 25] });
        }
        // Label "Signature"
        doc.fontSize(7).font('Helvetica').fillColor(black).text('Signature', sigX, sigY + 27, { width: 50, align: 'center' });


        // ================== BACK CARD (School Details) ==================
        
        // 1. Border (Black)
        doc.rect(backX, startY, cardW, cardH).fill(white).stroke(black).lineWidth(2);

        // 2. Header (Yellow)
        doc.rect(backX, startY, cardW, 25).fill(yellow);
        doc.fillColor(black).fontSize(11).font('Helvetica-Bold')
           .text('SCHOOL DETAILS', backX, startY + 6, { width: cardW, align: 'center' });

        // 3. Address & Contact (Top Section)
        doc.fillColor(black).fontSize(9);
        let bTextY = startY + 35;
        const bTextX = backX + 10;

        // Address
        doc.font('Helvetica-Bold').text('Address:', bTextX, bTextY);
        doc.font('Helvetica').text(user.address.fullAddress, bTextX + 45, bTextY, { width: cardW - 55 });
        bTextY += 15;
        
        // City/State
        doc.font('Helvetica').text(`${user.address.city}, ${user.address.state} - ${user.address.pinCode}`, bTextX + 45, bTextY);
        bTextY += 15;
        
        // Phone
        doc.font('Helvetica-Bold').text('Contact:', bTextX, bTextY);
        doc.font('Helvetica').text(user.number, bTextX + 45, bTextY);
        bTextY += 15;

        // Mother
        doc.font('Helvetica-Bold').text('Mother:', bTextX, bTextY);
        doc.font('Helvetica').text(user.motherName, bTextX + 45, bTextY);

        // 4. QR Code (Centered at Bottom)
        const qrSize = 45;
        const qrX = backX + (cardW / 2) - (qrSize / 2); // Centered Horizontally
        const qrY = startY + 100; // Position in lower middle

        doc.image(qrPath, qrX, qrY, { fit: [qrSize, qrSize] });
        
        // Text under QR
        doc.fontSize(7).fillColor(black).text('Scan to Verify', backX, qrY + qrSize + 2, { width: cardW, align: 'center' });

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
});

module.exports = router;