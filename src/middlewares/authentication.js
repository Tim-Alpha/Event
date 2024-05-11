import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { Token, User } = db;

const generateToken = async (user) => {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '60d' });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);

    await Token.create({
        token,
        userId: user.id,
        expiresAt,
        isDisabled: false
    });

    return token;
};

const verifyToken = async (req, res, next) => {
    const token = req.headers['event-token'];
    if (!token) {
        return res.status(401).json({ message: "event-token header is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenRecord = await Token.findOne({
            where: { token, userId: decoded.userId, isDisabled: false }
        });

        if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
            throw new Error('Token is expired or invalid');
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};


export { generateToken, verifyToken }