// CODE-AND-CONNECT Logic with Onboarding

// Types
interface SubInterestMap {
    [key: string]: { id: string; label: string; icon: string }[];
}

const subInterestsData: SubInterestMap = {
    webdev: [
        { id: 'react', label: 'React', icon: 'fa-brands fa-react' },
        { id: 'nextjs', label: 'Next.js', icon: 'fa-solid fa-n' },
        { id: 'node', label: 'Node.js', icon: 'fa-brands fa-node-js' }
    ],
    web3: [
        { id: 'solana', label: 'Solana', icon: 'fa-solid fa-link' },
        { id: 'ethereum', label: 'Ethereum', icon: 'fa-brands fa-ethereum' },
        { id: 'smartcontracts', label: 'Smart Contracts', icon: 'fa-solid fa-file-contract' }
    ],
    lowlevel: [
        { id: 'cpp', label: 'C++', icon: 'fa-solid fa-c' },
        { id: 'rust', label: 'Rust', icon: 'fa-solid fa-gear' },
        { id: 'os', label: 'Operating Systems', icon: 'fa-solid fa-microchip' }
    ],
    ai: [
        { id: 'ml', label: 'Machine Learning', icon: 'fa-solid fa-brain' },
        { id: 'llm', label: 'LLMs', icon: 'fa-solid fa-robot' },
        { id: 'pytorch', label: 'PyTorch', icon: 'fa-solid fa-fire' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // --- ONBOARDING LOGIC ---
    let selectedMainInterests: string[] = [];
    let selectedSubInterests: string[] = [];

    const overlay = document.getElementById('onboardingOverlay');
    const step1 = document.getElementById('onboardingStep1');
    const step2 = document.getElementById('onboardingStep2');
    
    const mainCards = document.querySelectorAll('#mainInterestsGrid .interest-card');
    const nextStepBtn = document.getElementById('nextStepBtn') as HTMLButtonElement;
    
    const subGrid = document.getElementById('subInterestsGrid');
    const prevStepBtn = document.getElementById('prevStepBtn');
    const finishBtn = document.getElementById('finishOnboardingBtn') as HTMLButtonElement;

    const dynamicTabs = document.getElementById('dynamicTabs');

    // Step 1: Selection
    mainCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
            const val = card.getAttribute('data-value');
            if (val) {
                if (selectedMainInterests.includes(val)) {
                    selectedMainInterests = selectedMainInterests.filter(i => i !== val);
                } else {
                    selectedMainInterests.push(val);
                }
            }
            nextStepBtn.disabled = selectedMainInterests.length === 0;
        });
    });

    // Go to Step 2
    if (nextStepBtn && step1 && step2 && subGrid) {
        nextStepBtn.addEventListener('click', () => {
            step1.classList.remove('active');
            step2.classList.add('active');

            // Populate Step 2
            subGrid.innerHTML = '';
            selectedMainInterests.forEach(main => {
                const subs = subInterestsData[main];
                if (subs) {
                    subs.forEach(sub => {
                        const div = document.createElement('div');
                        div.className = 'interest-card';
                        div.setAttribute('data-value', sub.id);
                        div.setAttribute('data-label', sub.label);
                        div.innerHTML = \`<i class="\${sub.icon}"></i><span>\${sub.label}</span>\`;
                        
                        div.addEventListener('click', () => {
                            div.classList.toggle('selected');
                            if (selectedSubInterests.includes(sub.label)) {
                                selectedSubInterests = selectedSubInterests.filter(i => i !== sub.label);
                            } else {
                                selectedSubInterests.push(sub.label);
                            }
                            finishBtn.disabled = selectedSubInterests.length === 0;
                        });
                        
                        subGrid.appendChild(div);
                    });
                }
            });
        });
    }

    // Go back to Step 1
    if (prevStepBtn && step1 && step2) {
        prevStepBtn.addEventListener('click', () => {
            step2.classList.remove('active');
            step1.classList.add('active');
            selectedSubInterests = []; // reset
            finishBtn.disabled = true;
        });
    }

    // Finish Onboarding
    if (finishBtn && overlay && dynamicTabs) {
        finishBtn.addEventListener('click', () => {
            // Hide overlay
            overlay.classList.add('hidden');

            // Update main feed tabs based on selection
            let tabsHtml = \`<div class="tab active">For you</div><div class="tab">Following</div>\`;
            
            // Add up to 3 selected sub-interests as tabs
            const tabsToAdd = selectedSubInterests.slice(0, 3);
            tabsToAdd.forEach(tab => {
                tabsHtml += \`<div class="tab">\${tab}</div>\`;
            });
            
            dynamicTabs.innerHTML = tabsHtml;

            // Re-bind tab click events
            bindTabEvents();
        });
    }


    // --- SOCIAL FEED LOGIC ---
    function bindTabEvents() {
        const tabs = document.querySelectorAll('.feed-tabs .tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                tabs.forEach(t => t.classList.remove('active'));
                target.classList.add('active');
            });
        });
    }
    // Bind initial tabs just in case
    bindTabEvents();

    // Auto-resize textarea
    const postInput = document.getElementById('postInput') as HTMLTextAreaElement | null;
    if (postInput) {
        postInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    // Post submit logic
    const submitPostBtn = document.getElementById('submitPostBtn') as HTMLButtonElement | null;
    const postsContainer = document.getElementById('posts-container') as HTMLElement | null;

    if (submitPostBtn && postsContainer && postInput) {
        submitPostBtn.addEventListener('click', () => {
            const text = postInput.value.trim();
            if (!text) return;

            const newPost = document.createElement('article');
            newPost.className = 'post';
            
            const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

            newPost.innerHTML = \`
                <div class="avatar-placeholder">DU</div>
                <div class="post-content">
                    <div class="post-header">
                        <span class="name">Dev User</span>
                        <span class="handle">@devuser</span>
                        <span class="time">· just now</span>
                    </div>
                    <div class="post-text">
                        \${safeText}
                    </div>
                    <div class="post-interactions">
                        <span><i class="fa-regular fa-comment"></i> 0</span>
                        <span><i class="fa-solid fa-retweet"></i> 0</span>
                        <span class="like-btn"><i class="fa-regular fa-heart"></i> 0</span>
                        <span><i class="fa-solid fa-chart-simple"></i> 0</span>
                        <span><i class="fa-solid fa-arrow-up-from-bracket"></i></span>
                    </div>
                </div>
            \`;

            const likeBtn = newPost.querySelector('.like-btn') as HTMLElement;
            if (likeBtn) {
                let liked = false;
                likeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    liked = !liked;
                    if (liked) {
                        this.classList.add('liked');
                        this.innerHTML = '<i class="fa-solid fa-heart"></i> 1';
                    } else {
                        this.classList.remove('liked');
                        this.innerHTML = '<i class="fa-regular fa-heart"></i> 0';
                    }
                });
            }

            postsContainer.insertBefore(newPost, postsContainer.firstChild);
            postInput.value = '';
            postInput.style.height = 'auto';
        });
    }

    // Existing likes logic
    const existingLikeBtns = document.querySelectorAll('.like-btn');
    existingLikeBtns.forEach(btn => {
        let liked = false;
        let htmlElement = btn as HTMLElement;
        let count = parseInt(htmlElement.innerText.trim().replace(/k/g, '000').replace(/\\./g, ''));
        if (isNaN(count)) count = Math.floor(Math.random() * 100) + 10;
        
        htmlElement.addEventListener('click', function(e) {
            e.stopPropagation();
            liked = !liked;
            if (liked) {
                this.classList.add('liked');
                this.innerHTML = \`<i class="fa-solid fa-heart"></i> \${count + 1}\`;
            } else {
                this.classList.remove('liked');
                this.innerHTML = \`<i class="fa-regular fa-heart"></i> \${count}\`;
            }
        });
    });
});
