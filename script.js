document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabs = document.querySelectorAll('.feed-tabs .tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Here we would normally filter posts, but for the mock up we can just leave it visual
        });
    });

    // Auto-resize textarea
    const postInput = document.getElementById('postInput');
    postInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Post submit logic
    const submitPostBtn = document.getElementById('submitPostBtn');
    const postsContainer = document.getElementById('posts-container');

    submitPostBtn.addEventListener('click', () => {
        const text = postInput.value.trim();
        if (!text) return;

        // Create new post element
        const newPost = document.createElement('article');
        newPost.className = 'post';
        
        // Escape basic HTML to prevent injection
        const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

        newPost.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=Dev+User&background=random" alt="Avatar" class="avatar">
            <div class="post-content">
                <div class="post-header">
                    <span class="name">Dev User</span>
                    <span class="handle">@devuser</span>
                    <span class="time">· just now</span>
                </div>
                <div class="post-text">
                    ${safeText}
                </div>
                <div class="post-interactions">
                    <span><i class="fa-regular fa-comment"></i> 0</span>
                    <span><i class="fa-solid fa-retweet"></i> 0</span>
                    <span class="like-btn"><i class="fa-regular fa-heart"></i> 0</span>
                    <span><i class="fa-solid fa-chart-simple"></i> 0</span>
                    <span><i class="fa-solid fa-arrow-up-from-bracket"></i></span>
                </div>
            </div>
        `;

        // Add like functionality to the new post
        const likeBtn = newPost.querySelector('.like-btn');
        let liked = false;
        likeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            liked = !liked;
            if (liked) {
                this.innerHTML = '<i class="fa-solid fa-heart" style="color: var(--accent-red)"></i> 1';
                this.style.color = 'var(--accent-red)';
            } else {
                this.innerHTML = '<i class="fa-regular fa-heart"></i> 0';
                this.style.color = 'var(--text-muted)';
            }
        });

        // Prepend to posts container (at the top)
        postsContainer.insertBefore(newPost, postsContainer.firstChild);

        // Clear input
        postInput.value = '';
        postInput.style.height = 'auto';
    });

    // Add like functionality to existing mock posts
    const existingLikeBtns = document.querySelectorAll('.like-btn');
    existingLikeBtns.forEach(btn => {
        let liked = false;
        let count = parseInt(btn.innerText.trim());
        
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            liked = !liked;
            if (liked) {
                this.innerHTML = \`<i class="fa-solid fa-heart" style="color: var(--accent-red)"></i> \${count + 1}\`;
                this.style.color = 'var(--accent-red)';
            } else {
                this.innerHTML = \`<i class="fa-regular fa-heart"></i> \${count}\`;
                this.style.color = 'var(--text-muted)';
            }
        });
    });
});
