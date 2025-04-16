const { s3 } = require("./s3client");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs")


const uploadToS3 = async (filepath, filename, mimetype) => {
    const filestream = fs.createReadStream(filepath);
    
    // Generate unique S3 key with folder structure
    const s3key = `unedited/${Date.now()}_${filename.replace(/\s+/g, '_')}`;
    
    const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3key,
        Body: filestream,
        ContentType: mimetype,
        // Additional security headers
        ACL: 'private', // Ensure private access by default
        Metadata: {
            'uploaded-at': new Date().toISOString()
        }
    };

    try {
        await s3.send(new PutObjectCommand(uploadParams));
        
        // Verify upload success (optional)
        const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3key}`;
        
        console.log(`✅ Upload successful: ${filename} → ${s3key}`);
        return s3key;

    } catch (err) {
        console.error("❌ S3 upload failed:", err);
        
        // Enhanced error handling
        if (err.name === 'NoSuchBucket') {
            throw new Error("S3 bucket not found - check configuration");
        } else if (err.name === 'AccessDenied') {
            throw new Error("S3 access denied - check IAM permissions");
        } else {
            throw new Error("File upload failed");
        }
    } finally {
        // Ensure file stream is always closed
        filestream.close();
    }
};

module.exports = uploadToS3