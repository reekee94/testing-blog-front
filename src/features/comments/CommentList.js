import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import {
  getCommentsForArticle,
  removeComment,
  selectAllComments,
  selectIsAuthor,
  selectIsLoading,
} from './commentsSlice';


function DeleteCommentButton({ commentId }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const { slug } = useParams();

  const deleteComment = () => {
    dispatch(removeComment({ articleSlug: slug, commentId }));
  };

  return (
    <button
      className="btn btn-sm btn-link mod-options"
      disabled={isLoading}
      onClick={deleteComment}
    >
      <i className="ion-trash-a" />
      <span className="sr-only">Delete comment</span>
    </button>
  );
}

function Comment({ comment }) {
  const isAuthor = useSelector(selectIsAuthor(comment.id));

  return (
    <div className="card" data-testid="comment">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>

      <div className="card-footer">
        <Link to={`/@${comment.author.username}`} className="comment-author">
          <img
            className="comment-author-img"
            alt={comment.author.username}
            src={
              comment.author.image ??
              'https://clementjames.org/wp-content/uploads/2019/09/avatar-1577909_960_720-1.png'
            }
          />
        </Link>
        &nbsp;
        <Link to={`/@${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <time className="date-posted" dateTime={comment.createdAt}>
          {new Date(comment.createdAt).toDateString()}
        </time>
        {isAuthor ? <DeleteCommentButton commentId={comment.id} /> : null}
      </div>
    </div>
  );
}

function CommentList() {
  const dispatch = useDispatch();
  const comments = useSelector(selectAllComments);
  const isLoading = useSelector(selectIsLoading);
  const { slug } = useParams();

  useEffect(() => {
    const fetchComments = dispatch(getCommentsForArticle(slug));

    return () => {
      fetchComments.abort();
    };
  }, [slug]);

  if (isLoading) {
    return <p>Loading comments</p>;
  }

  return (
    <>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </>
  );
}

export default memo(CommentList);
