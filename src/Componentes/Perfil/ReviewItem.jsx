import './ReviewItem.css';

const ReviewItem = ({ review, showCourse }) => {
  return (
    <div className="review-item">
      <div className="left-section">
        <img className="profile-pic" src={review.image || '/default-avatar.png'} alt="profile" />
        <div className="student-info">
          <div className="name-time">
            <span className="name">{review.studentName}</span>
            <span className="time">{review.timeAgo}</span>
          </div>
          <div className="course-grade">
            {showCourse && (
              <span className="course">
                📘 <strong>Curso:</strong> {review.course}
              </span>
            )}
            {review.grade && (
              <span className="grade">
                🧾 <strong>Nota recibida:</strong> {review.grade}
              </span>
            )}
          </div>
          <div className="comment-bubble">{review.comment}</div>
          <div className="labels">
            {review.labels.map((label, index) => (
              <span key={index} className="chip-label">{label.name}</span>
            ))}

          </div>
        </div>
      </div>

      <div className="right-section">
        <div className="emoji">{review.emoji || '😊'}</div>
        <div className="rating-label">{review.ratingLabel}</div>
        <div className="vote-icons">👍 🔁</div>
      </div>
    </div>
  );
};

export default ReviewItem;
