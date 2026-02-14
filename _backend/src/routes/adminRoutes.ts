import { Router } from 'express';
import type { Request, Response } from 'express';
import { User } from '../models/user.ts';
import { requireAuth, requireAdmin } from '../middleware/auth.ts';

const router = Router();

// GET /api/admin/users - list registered users (admin only)
router.get('/users', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
        // Exclude password field
        const users = await User.find().select('username email role createdAt').lean();
        const mapped = users.map(u => ({ id: u._id, username: u.username, email: u.email, role: u.role, createdAt: u.createdAt }));
        res.json(mapped);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/admin/users/:id - remove a registered user (admin only)
router.delete('/users/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndDelete(id as any);
        if (!deleted) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User removed' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
