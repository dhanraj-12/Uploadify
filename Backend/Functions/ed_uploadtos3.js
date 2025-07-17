const { s3 } = require("./s3client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs")


const uploadToS3 = async (filepath,filename) => {
    
    try {
        const filestream = fs.createReadStream(filepath);
        const s3key = `edited/${Date.now()}_${filename}`; 
        const uploadParams = {
            Bucket : process.env.S3_BUCKET_NAME,
            Key : s3key,
            Body : filestream,
            ContentType : "video/mp4"
        };

        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        console.log("✅ File uploaded successfully:", filename);
        return s3key;


        } catch(err) {
            console.error("❌ Upload failed:", err);
            throw err;
        }
}



module.exports = uploadToS3