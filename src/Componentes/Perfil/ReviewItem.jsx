import './ReviewItem.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReviewItem = ({ review, showCourse, onLike, onDislike }) => {
  return (
    <div className="review-item container-fluid">
      <div className="row align-items-start">

        {/* Sección izquierda */}
       <div className="col-12 col-md-9 d-flex gap-3 align-items-start">

          <img
            className="profile-pic"
            src={review.anonimo ? '/anonimo.png' : (review.image || '/profileDefault.png')}
            alt="profile"
          />

          <div className="student-info">
            <div className="name-time d-flex gap-2 flex-wrap">
              <span className="fw-semibold">{review.anonimo ? 'Anónimo' : review.username}</span>
              <span className="time">{review.date}</span>
            </div>

            {/* Curso y nota */}
           <div className="course-grade d-flex flex-wrap gap-2 mb-1">
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

            {/* Comentario */}
            {review.comment && (
              <div className="comment-bubble mt-2">{review.comment}</div>
            )}

            {/* Etiquetas */}
            <div className="labels">
              {review.labels.map((label, index) => (
                <span key={index} className="chip-label">{label.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sección derecha */}
        <div className="col-12 col-md-3 d-flex flex-column align-items-center justify-content-center mt-3 mt-md-0">
          <div className="emoji">{review.emoji || '😊'}</div>
          <div className="rating-label">{review.ratingLabel}</div>
          <div className="vote-icons d-flex mt-2">
            <div className="vote-item me-3" onClick={onLike}>
              <i className="bi bi-hand-thumbs-up"></i>
              <span className="vote-count ms-1">{review.likes ?? 0}</span>
            </div>
            <div className="vote-item" onClick={onDislike}>
              <i className="bi bi-hand-thumbs-down"></i>
              <span className="vote-count ms-1">{review.dislikes ?? 0}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewItem;
