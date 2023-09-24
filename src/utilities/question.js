export const sortQuestions = (questions) => {
    console.log(questions);
    return questions.sort((item1, item2) => {
        if (item2.totalVoted - item1.totalVoted === 0) {
            if (item1.isAnswered === item2.isAnswered) {
                return new Date(item2.createdAt) - new Date(item1.createdAt);
            }
            if (item2.isAnswered) {
                return 1;
            }
            if (item1.isAnswered) {
                return -1;
            }
        }
        return item2.totalVoted - item1.totalVoted;
    });
};
