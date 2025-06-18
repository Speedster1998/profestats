import './ReviewItem.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ReviewItem = ({ review, showCourse, onLike, onDislike }) => {
  return (
    <div className="review-item">
      <div className="left-section">
        <img className="profile-pic" src={review.image || '/default-avatar.png'} alt="profile" />
        <div className="student-info">
          <div className="name-time">
            <span className="name">{review.username}</span>
            <span className="time">{review.date}</span>
          </div>
          <div className="course-grade">
            {showCourse && (
              <span className="course">
                <strong>📚 Curso:</strong> {review.course}
              </span>
            )}
            {review.nota && (
              <span className="grade">
                <strong>📝 Nota recibida:</strong> {review.nota}
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
        <div className="vote-icons">
          <div className="vote-item" onClick={onLike}>
            <i className="bi bi-hand-thumbs-up"></i>
            <span className="vote-count">{review.likes ?? 0}</span>
          </div>
          <div className="vote-item ms-3" onClick={onDislike} >
            <i className="bi bi-hand-thumbs-down"></i>
            <span className="vote-count">{review.dislikes ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
