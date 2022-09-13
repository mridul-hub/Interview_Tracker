const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth , adminAuth} = require('../middleware/authMiddleware')
const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
// router.get('/topic',authController.topic_get);
router.get('/adminpanel',adminAuth,authController.admin_get);
router.post('/adminpanel',adminAuth,authController.admin_post);
router.get('/topic',requireAuth,authController.topic_get);
router.get('/topic/:name',requireAuth,authController.question_get);
// router.get('/profile',requireAuth,authController.profile_get);

module.exports = router;