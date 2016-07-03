export function findPostById( posts, id ) {
	return posts.reduce( ( found, post ) => {
		if ( post.ID === id ) {
			return post;
		}
		return found;
	}, [] );
}

