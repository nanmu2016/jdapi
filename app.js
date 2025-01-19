const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

// 处理文件上传的路由
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path));

        const response = await axios.post('https://api.xinyew.cn/api/jdtc', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        // 删除临时文件
        fs.unlinkSync(file.path);

        res.json(response.data);
    } catch (error) {
        console.error('上传错误:', error);
        res.status(500).json({ errno: 1, message: '上传失败' });
    }
});

const PORT = process.env.PORT || 8600;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 