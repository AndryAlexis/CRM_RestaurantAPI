const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require("nodemailer");


/**
 * Generates a JWT token with the provided payload
 * @param {Object} payload - Data to be encoded in the token
 * @param {string|number} payload.id - User ID to encode in token
 * @param {string} payload.role - User role to encode in token
 * @returns {string} JWT token signed with the secret key from environment variables
 */
const generateToken = ({ id, role }) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { noTimestamp: true });
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded payload if token is valid
 * @throws {JsonWebTokenError} If token is invalid or expired
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Checks if an object contains all the required keys
 * @param {Object} obj - Object to check for keys
 * @param {string[]} keys - Array of key names to check for
 * @returns {Object} Result object containing:
 *   - hasAllKeys {boolean}: true if all keys exist, false otherwise
 *   - missingKeys {string[]}: array of keys that were not found in the object
 */
const hasKeys = (obj, keys) => {
    const missingKeys = keys.filter(key => !obj.hasOwnProperty(key));
    return {
        hasAllKeys: missingKeys.length === 0,
        missingKeys
    };
}

/**
 * Checks if an object contains at least one of the specified keys
 * @param {Object} obj - Object to check for keys
 * @param {string[]} keys - Array of key names to check for
 * @returns {Object} Result object containing:
 *   - hasAtLeastOneKey {boolean}: true if at least one key exists, false if none exist
 *   - missingKeys {string[]}: array of keys that were not found in the object
 */
const hasAtLeastOneKey = (obj, keys) => {
    const missingKeys = keys.filter(key => !obj.hasOwnProperty(key));
    return {
        hasSomeKeys: missingKeys.length < keys.length,
        missingKeys
    };
}

/**
 * Controls the length of a string by truncating or padding
 * @param {string} str - The string to control length of
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if string length is within the limit, false otherwise
 */
const isStringLengthValid = (str, maxLength) => {
    return String(str.length) <= maxLength;
}

// Remove spaces from end and start from a string
const removeSpaces = (str) => {
    const string = String(str);
    return string.trim();
}

// Check if a value is a number
const isNumber = (value) => {
    return !isNaN(value);
}


const sendEmail = (to, title, text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const main = async () => {    
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to,
            subject: 'Frontend Feast',
            html: `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
  <head>
    <!-- Compiled with Bootstrap Email version: 1.3.1 -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <style type="text/css">
      body,table,td{font-family:Helvetica,Arial,sans-serif !important}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}*{color:inherit}a[x-apple-data-detectors],u+#body a,#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}img{-ms-interpolation-mode:bicubic}table:not([class^=s-]){font-family:Helvetica,Arial,sans-serif;mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;border-collapse:collapse}table:not([class^=s-]) td{border-spacing:0px;border-collapse:collapse}@media screen and (max-width: 600px){.w-lg-48,.w-lg-48>tbody>tr>td{width:auto !important}.w-full,.w-full>tbody>tr>td{width:100% !important}.w-16,.w-16>tbody>tr>td{width:64px !important}.p-lg-10:not(table),.p-lg-10:not(.btn)>tbody>tr>td,.p-lg-10.btn td a{padding:0 !important}.p-2:not(table),.p-2:not(.btn)>tbody>tr>td,.p-2.btn td a{padding:8px !important}.pr-4:not(table),.pr-4:not(.btn)>tbody>tr>td,.pr-4.btn td a,.px-4:not(table),.px-4:not(.btn)>tbody>tr>td,.px-4.btn td a{padding-right:16px !important}.pl-4:not(table),.pl-4:not(.btn)>tbody>tr>td,.pl-4.btn td a,.px-4:not(table),.px-4:not(.btn)>tbody>tr>td,.px-4.btn td a{padding-left:16px !important}.pr-6:not(table),.pr-6:not(.btn)>tbody>tr>td,.pr-6.btn td a,.px-6:not(table),.px-6:not(.btn)>tbody>tr>td,.px-6.btn td a{padding-right:24px !important}.pl-6:not(table),.pl-6:not(.btn)>tbody>tr>td,.pl-6.btn td a,.px-6:not(table),.px-6:not(.btn)>tbody>tr>td,.px-6.btn td a{padding-left:24px !important}.pt-8:not(table),.pt-8:not(.btn)>tbody>tr>td,.pt-8.btn td a,.py-8:not(table),.py-8:not(.btn)>tbody>tr>td,.py-8.btn td a{padding-top:32px !important}.pb-8:not(table),.pb-8:not(.btn)>tbody>tr>td,.pb-8.btn td a,.py-8:not(table),.py-8:not(.btn)>tbody>tr>td,.py-8.btn td a{padding-bottom:32px !important}*[class*=s-lg-]>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-4>tbody>tr>td{font-size:16px !important;line-height:16px !important;height:16px !important}.s-6>tbody>tr>td{font-size:24px !important;line-height:24px !important;height:24px !important}}
    </style>
  </head>
  <body style="background-color: #f3f0e8; outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f3f0e8">
    <table class="body" valign="top" role="presentation" border="0" cellpadding="0" cellspacing="0" style="background-color: #f3f0e8; outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f3f0e8">
      <tbody>
        <tr>
          <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0;" align="left" bgcolor="#f3f0e8">
            <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
              <tbody>
                <tr>
                  <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
                    <!--[if (gte mso 9)|(IE)]>
                      <table align="center" role="presentation">
                        <tbody>
                          <tr>
                            <td width="600">
                    <![endif]-->
                    <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
                      <tbody>
                        <tr>
                          <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                            <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                              <tbody>
                                <tr>
                                  <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                              <tbody>
                                <tr>
                                  <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div class="space-y-4">
                              <h2 class="text-4xl fw-800" style="padding-top: 0; padding-bottom: 0; font-weight: 800 !important; vertical-align: baseline; font-size: 36px; line-height: 43.2px; margin: 0;" align="center">${title}</h2>
                            </div>
                            <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                              <tbody>
                                <tr>
                                  <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="card rounded-3xl px-4 py-8 p-lg-10" role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-radius: 24px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;" bgcolor="#ffffff">
                              <tbody>
                                <tr>
                                  <td style="line-height: 24px; font-size: 16px; width: 100%; border-radius: 24px; margin: 0; padding: 40px;" align="left" bgcolor="#ffffff">
                                    <table class="p-2 w-full" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                      <tbody>
                                        <tr>
                                          <td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 8px;" align="left" width="100%">
                                            ${text}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                      <tbody>
                                        <tr>
                                          <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                            &#160;
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table class="hr" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                      <tbody>
                                        <tr>
                                          <td style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; height: 1px; width: 100%; margin: 0;" align="left">
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                      <tbody>
                                        <tr>
                                          <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                            &#160;
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <p style="line-height: 24px; font-size: 14px; width: 100%; margin: 0;" align="left">
                                      Con mucho cariño, el equipo de <strong>Frontend Feast</strong>.
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table class="s-6 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                              <tbody>
                                <tr>
                                  <td style="line-height: 24px; font-size: 24px; width: 100%; height: 24px; margin: 0;" align="left" width="100%" height="24">
                                    &#160;
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <!--[if (gte mso 9)|(IE)]>
                    </td>
                  </tr>
                </tbody>
              </table>
                    <![endif]-->
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script></body>
</html>

            `
        });
    }

    main().catch(console.error);
}

module.exports = {
    generateToken,
    verifyToken,
    hasKeys,
    hasAtLeastOneKey,
    isStringLengthValid,
    removeSpaces,
    isNumber,
    sendEmail
};