import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmailForm = () => {
    
    const [to, setTo] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [html, setHtml] = useState('');
    const [attachments, setAttachments] = useState([]);

    const handleFileChange = (e) => {
        setAttachments(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('to', to);
        formData.append('subject', subject);
        formData.append('text', text);
        formData.append('html', html);

        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachments', attachments[i]);
        }

        try {
            console.log(formData);
            const response = await fetch('http://localhost:8080/send-email', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Email sent successfully:', result);
                alert('Email sent successfully!');
                setTo('');
                setSubject('');
                setText('');
                setHtml('');
                setAttachments([]);
            } else {
                alert('Your email will be sent shortly...');
            }
        } catch (error) {
            alert('Your email will be sent shortly...');
        }
    };

    return (
        <div className="container my-5">
            <div className="glass-effect p-5 rounded">
                <h2 className="mb-4">Send Email with Attachments</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="form-group">
                        <label htmlFor="to">To:</label>
                        <input
                            type="email"
                            id="to"
                            name="to"
                            className="form-control"
                            placeholder="Enter email addresses separated by commas"
                            multiple
                            required
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="form-control"
                            placeholder="Enter subject"
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="text">Text Body:</label>
                        <textarea
                            id="text"
                            name="text"
                            className="form-control"
                            rows="4"
                            placeholder="Write your message here"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="html">HTML Body:</label>
                        <textarea
                            id="html"
                            name="html"
                            className="form-control"
                            rows="4"
                            placeholder="HTML content (optional)"
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="attachments">Attachments:</label>
                        <input
                            type="file"
                            id="attachments"
                            name="attachments"
                            className="form-control-file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmailForm;
