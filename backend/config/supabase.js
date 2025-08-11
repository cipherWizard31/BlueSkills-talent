import { createClient } from '@supabase/supabase-js';
import fs from 'fs' 


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; 

const supabase = createClient(supabaseUrl, supabaseKey);

const pdfPath = './path/to/your/document.pdf';
const pdfBuffer = fs.readFileSync(pdfPath);

async function uploadPdfToSupabase() {
    const bucketName = 'resumes';
    const filePath = "C:/Users/natha/Documents/Finished CTE.pdf";

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, pdfBuffer, {
            contentType: 'application/pdf', 
            upsert: true,
        });

    if (error) {
        console.error('Error uploading PDF:', error.message);
    } else {
        console.log('PDF uploaded successfully:', data);
    }
}

uploadPdfToSupabase();