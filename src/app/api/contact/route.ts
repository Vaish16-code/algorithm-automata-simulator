import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

// Contact form submission interface
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/[<>]/g, '')
              .trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      subject: sanitizeInput(body.subject),
      message: sanitizeInput(body.message)
    };

    // Validate message length
    if (sanitizedData.message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Create transporter for sending emails
    // You'll need to set up these environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your email
        pass: process.env.SMTP_PASS, // Your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || 'help.algomaster@gmail.com', // Where you want to receive messages
      subject: `[AlgoMaster Contact] ${sanitizedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f8f9fa;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Name:</strong>
                <p style="margin: 5px 0; color: #333;">${sanitizedData.name}</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Email:</strong>
                <p style="margin: 5px 0; color: #333;">
                  <a href="mailto:${sanitizedData.email}" style="color: #667eea; text-decoration: none;">
                    ${sanitizedData.email}
                  </a>
                </p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Subject:</strong>
                <p style="margin: 5px 0; color: #333;">${sanitizedData.subject}</p>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #555;">Message:</strong>
                <div style="margin: 10px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #667eea; color: #333; line-height: 1.6;">
                  ${sanitizedData.message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  Submitted on: ${new Date().toLocaleString()}
                </p>
                <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">
                  From: AlgoMaster Contact Form
                </p>
              </div>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; background-color: #333; color: white;">
            <p style="margin: 0; font-size: 14px;">© 2025 AlgoMaster - Engineering Solutions</p>
          </div>
        </div>
      `,
      // Also send a plain text version
      text: `
New Contact Form Submission from AlgoMaster

Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Subject: ${sanitizedData.subject}

Message:
${sanitizedData.message}

Submitted on: ${new Date().toLocaleString()}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Optional: Send confirmation email to user
    const confirmationEmail = {
      from: process.env.SMTP_USER,
      to: sanitizedData.email,
      subject: 'Thank you for contacting AlgoMaster',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You!</h1>
          </div>
          
          <div style="padding: 20px;">
            <h2 style="color: #333;">Hi ${sanitizedData.name},</h2>
            
            <p style="color: #555; line-height: 1.6;">
              Thank you for reaching out to AlgoMaster! We've received your message and will get back to you within 24 hours.
            </p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Your message:</h3>
              <p style="color: #666; font-style: italic;">"${sanitizedData.message.substring(0, 100)}${sanitizedData.message.length > 100 ? '...' : ''}"</p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              In the meantime, feel free to explore our interactive algorithm simulators and educational content.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit AlgoMaster
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              Best regards,<br>
              The AlgoMaster Team
            </p>
          </div>
          
          <div style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #666; font-size: 14px;">
            <p style="margin: 0;">© 2025 AlgoMaster - Engineering Solutions</p>
          </div>
        </div>
      `
    };

    // Send confirmation email to user
    await transporter.sendMail(confirmationEmail);

    // Log successful submission (you might want to store this in a database)
    console.log('Contact form submission received:', {
      name: sanitizedData.name,
      email: sanitizedData.email,
      subject: sanitizedData.subject,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        message: 'Message sent successfully! We will get back to you within 24 hours.',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again later or contact us directly at help.algomaster@gmail.com',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Contact API endpoint is working',
      methods: ['POST'],
      fields: ['name', 'email', 'subject', 'message']
    },
    { status: 200 }
  );
}
