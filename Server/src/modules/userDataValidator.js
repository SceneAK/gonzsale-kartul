import dns from 'dns';

function isValidName(name) { return !name.includes(' '); } // Anything more?


async function formatAndRegexCheck(email)
{
    // Test format. Got the regex from copilot
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) { return false;}
    
    const validDomain = await (() => {
        const domain = email.split('@')[1];
        return new Promise((resolve) =>{
            dns.resolveMx(domain, (err, addresses) => {
                resolve(err || addresses.length === 0)
            })
        });
    })()
    if(!validDomain) { return false; }
    return true;
}
async function isValidEmail(email) { 
    if(!formatAndRegexCheck(email)) return false;    

    // // send email verification
    // let isVerified = false;
    // let i = 0;
    // while(!isVerified) { 
    //     await delay(5000); // 5s wait
    //     isVerified = await checkVerificationStatus(userEmail, verificationCode); 

    //     i++;
    //     if(i >= 360) { return false;} // Stops after 5s*360 = 30 minutes
    // }
    return true;
}

export{formatAndRegexCheck, isValidEmail, isValidName}