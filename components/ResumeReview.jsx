import React, { useState } from 'react';

const ResumeReview = () => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // TODO: Replace this with your new Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyjVCkqfp-iOHbRu_2L3Dvo-tXnJmAu7RjhWAlgO_empGh26apr91a1PLONQeYi_jlXZw/exec';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.target);
        formData.append('SheetName', 'Resume');
        try {
            const response = await fetch(scriptURL, { method: 'POST', body: formData });
            const result = await response.json();
            
            if (result.result === 'success') {
                setMessage('Your Response has been recorded successfully!');
                e.target.reset();
            } else {
                setMessage('Error: ' + (result.error || 'Something went wrong'));
            }
            
            setTimeout(() => {
                setMessage('');
            }, 4000);
        } catch (error) {
            console.error('Error!', error.message);
            setMessage('Error: Failed to submit. Please try again.');
            setTimeout(() => {
                setMessage('');
            }, 4000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form name="submit-to-google-sheet" className="contact-us-form" data-form onSubmit={handleSubmit}>
                <input type="text" placeholder="Your Name" className="form-control" name="Name" required />
                <input type="text" placeholder="Your Email" className="form-control" name="Mail" required />
                <input type="text" placeholder="Your Program" className="form-control" name="Program" required />
                <input type="text" placeholder="Your Department" className="form-control" name="Branch" required />
                <input type="text" placeholder="Current Study Year" className="form-control" name='Study_year' required />
                <input type="url" placeholder="Paste your PDF link here..." className="form-control" name="Resume_Link" required />
                <p style={({fontSize: "12px", color: "red"})}>*Please don&apos;t forget to give us pdf comment access</p>   
                <button className="submit-button" type="submit" disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload'}
                </button>
                <span id="message" className="success-message">{message}</span>

            </form>
           
        </div>
    )
}

export default ResumeReview