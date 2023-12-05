function App() {

    const APPEND_BY = 1
    const LOAD_POSTS_NUMBER = 5

    const [state, setState] = React.useState({
        posts: [],
        loadPosts: {
            from: 0,
            to: APPEND_BY
        },
        users: {}
    });

    function getAuthorDetails(authorID) {
        if (!state.users[authorID]) {
            fetch(`api/users/${authorID}?format=json`)
                .then(response => response.json())
                .then(data => setState(prevState => ({
                    ...prevState,
                    users: {
                        ...prevState.users,
                        [data.id]: data.username
                    }
                })));
        }
        console.log(state.users[authorID])
        return (
            state.users[authorID]
        )
    }

    function loadPosts() {
        fetch(`api/posts/${state.loadPosts.from}/${state.loadPosts.to}?format=json`)
            .then(response => response.json())
            .then(data => setState(prevState =>
                ({...prevState,
                    posts: [...prevState.posts, ...data]
            })));
    }


    function loadAndUpdatePosts() {
        loadPosts()
        setState({
            ...state,
            loadPosts: {
                from: state.loadPosts.from + APPEND_BY,
                to: state.loadPosts.to + APPEND_BY
            }
        })
    }

    function loadAndUpdateHelper() {
        const loadMore = document.querySelector('#loadMore')

        let count = 0;
        const limit = LOAD_POSTS_NUMBER;
        const intervalId = setInterval(() => {
            loadMore.click();
            count++;
            if (count === limit) {
                clearInterval(intervalId);
            }
        }, 200);
    }


    React.useEffect(() => {
        loadAndUpdateHelper()
    }, []);


    return (
        <div>
            <button id="loadMore" style={{display: 'none'}} onClick={loadAndUpdatePosts}></button>

            {state.posts.map((post, index) => (
            <div key={index}>
                <p>#{post.id} - {post.title} {state.users[post.author] ? state.users[post.author] : getAuthorDetails(post.author)}</p>
                <p>]]]]{post.content}</p>
            </div>
        ))}
            <button id="loadMoreButton" onClick={loadAndUpdateHelper}>Load more posts</button>
        </div>
    );
}

ReactDOM.render(<App />, document.querySelector("#app"));