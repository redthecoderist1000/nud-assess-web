import React from 'react';

const CreateQuestionManually = () => {
    return (
        <div>
            <h1>Create Question Manually</h1>
            <form>
                <div>
                    <label htmlFor="question">Question:</label>
                    <input type="text" id="question" name="question" />
                </div>
                <div>
                    <label htmlFor="answer">Answer:</label>
                    <input type="text" id="answer" name="answer" />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateQuestionManually;