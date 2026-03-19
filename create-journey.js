// create-journey.js

document.addEventListener('DOMContentLoaded', () => {
    
    // State
    const state = {
        currentStep: 1,
        maxSteps: 6, // 1 to 5 are form, 6 is confirmation
        selections: {
            type: '',
            story: '',
            storyText: '',
            style: '',
            format: '',
            size: '',
            reqName: '',
            reqEmail: '',
            reqPhone: '',
            reqMessage: ''
        }
    };

    // DOM Elements
    const heroSection = document.getElementById('journeyHero');
    const progressContainer = document.getElementById('journeyProgress');
    const journeyContainer = document.getElementById('journeyContainer');
    const controls = document.getElementById('journeyControls');
    const summaryPanel = document.getElementById('summaryPanelWrapper');
    const prevBtn = document.getElementById('prevBtn');

    // Make functions globally available for inline onclick attributes

    window.selectOption = (category, value, element) => {
        state.selections[category] = value;
        
        // Update visual selection
        const siblings = element.parentElement.querySelectorAll(element.classList.contains('pill-btn') ? '.pill-btn' : '.option-card');
        siblings.forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');

        updateSummaryPanel();

        // Auto-advance logic
        if (state.currentStep === 1 && category === 'type') {
            setTimeout(window.nextStep, 500);
        } else if (state.currentStep === 2 && category === 'story') {
            setTimeout(window.nextStep, 500);
        } else if (state.currentStep === 3 && category === 'style') {
            setTimeout(window.nextStep, 500);
        } else if (state.currentStep === 4) {
            if (state.selections.format && state.selections.size) {
                setTimeout(window.nextStep, 500);
            }
        }
    };

    window.nextStep = () => {
        if (!validateStep(state.currentStep)) {
            alert('Please make a selection before proceeding.');
            return;
        }

        if (state.currentStep < state.maxSteps) {
            const oldStep = state.currentStep;
            state.currentStep++;
            animateTransition(oldStep, state.currentStep, 'next');
            updateUI();
        }
    };

    window.prevStep = () => {
        if (state.currentStep > 1) {
            const oldStep = state.currentStep;
            state.currentStep--;
            animateTransition(oldStep, state.currentStep, 'prev');
            updateUI();
        }
    };

    window.submitJourney = () => {
        // Collect final form data
        state.selections.reqName = document.getElementById('reqName').value;
        state.selections.reqEmail = document.getElementById('reqEmail').value;
        state.selections.reqPhone = document.getElementById('reqPhone').value;
        state.selections.reqMessage = document.getElementById('reqMessage').value;
        const storyTextEl = document.getElementById('storyText');
        if (storyTextEl) state.selections.storyText = storyTextEl.value;

        if (!state.selections.reqName || !state.selections.reqEmail) {
            alert('Please fill out your name and email so we can reach you.');
            return;
        }

        // Advance to confirmation screen (Step 6)
        const oldStep = state.currentStep;
        state.currentStep = 6;
        
        // Hide controls and summary for final screen
        controls.style.display = 'none';
        summaryPanel.style.display = 'none';
        
        animateTransition(oldStep, state.currentStep, 'next');
        updateUI();

        // Send data to FormSubmit in background
        fetch("https://formsubmit.co/ajax/shaheenaneha3@gmail.com", {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: "New Custom Piece Request!",
                Name: state.selections.reqName,
                Email: state.selections.reqEmail,
                Phone: state.selections.reqPhone,
                Type: state.selections.type,
                Purpose: state.selections.story,
                Style: state.selections.style,
                Format: state.selections.format,
                Size: state.selections.size,
                Story: state.selections.storyText,
                Message: state.selections.reqMessage
            })
        }).catch(error => console.log("Form submission hidden error: ", error));
    };

    // Animations
    function animateTransition(oldStepIdx, newStepIdx, direction) {
        const oldStepEl = document.getElementById(`step${oldStepIdx}`);
        const newStepEl = document.getElementById(`step${newStepIdx}`);

        if (!oldStepEl || !newStepEl) return;

        // Reset classes
        oldStepEl.classList.remove('active-step', 'slide-left', 'slide-right');
        newStepEl.classList.remove('active-step', 'slide-left', 'slide-right');

        if (direction === 'next') {
            oldStepEl.classList.add('slide-left');
            // newStep will inherently slide in from right as per CSS (translateX(100%)) 
            // when active-step is added
        } else {
            oldStepEl.classList.add('slide-right');
            // Before newStep becomes active, we must position it to the left to slide in right
            newStepEl.style.transform = 'translateX(-100%)';
            // Force reflow
            void newStepEl.offsetWidth; 
        }

        setTimeout(() => {
            oldStepEl.style.display = 'none';
            newStepEl.style.display = 'block';
            
            // Remove inline style override
            newStepEl.style.transform = '';
            
            // Activate next step
            newStepEl.classList.add('active-step');
            
            window.scrollTo({ top: journeyContainer.offsetTop - 100, behavior: 'smooth' });
        }, 50); // Small delay to let classes apply initially
        
        // Hide old step after transition completes
        setTimeout(()=>{
             oldStepEl.classList.remove('slide-left', 'slide-right');
        }, 400);

        // Manage display to prevent huge page heights
        document.querySelectorAll('.journey-step').forEach((el, index) => {
            const stepNum = index + 1;
            if(stepNum !== oldStepIdx && stepNum !== newStepIdx) {
                el.style.display = 'none';
            }
        });
        oldStepEl.style.display = 'block';
        newStepEl.style.display = 'block';
    }

    // UI Updates
    function updateUI() {
        // Update Progress Bar
        const progressSteps = document.querySelectorAll('.progress-step');
        const progressLines = document.querySelectorAll('.progress-line');

        progressSteps.forEach((step, index) => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            
            // Make completed steps clickable
            step.onclick = () => {
                if (stepNum < state.currentStep) {
                    const oldStep = state.currentStep;
                    state.currentStep = stepNum;
                    animateTransition(oldStep, state.currentStep, 'prev');
                    updateUI();
                }
            };
            step.style.cursor = (stepNum < state.currentStep) ? 'pointer' : 'default';

            if (stepNum < state.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === state.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        progressLines.forEach((line, index) => {
            if (index < state.currentStep - 1) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });

        // Update Prev Button Visibility
        if (prevBtn) {
            prevBtn.style.visibility = state.currentStep > 1 ? 'visible' : 'hidden';
            if (state.currentStep === 1) prevBtn.style.display = 'none';
            else prevBtn.style.display = 'block';
        }
    }

    function updateSummaryPanel() {
        document.getElementById('sumType').innerText = state.selections.type || '-';
        document.getElementById('sumStory').innerText = state.selections.story || '-';
        document.getElementById('sumStyle').innerText = state.selections.style || '-';
        document.getElementById('sumFormat').innerText = state.selections.format || '-';
        document.getElementById('sumSize').innerText = state.selections.size || '-';
    }

    function validateStep(step) {
        switch (step) {
            case 1: return state.selections.type !== '';
            case 2: return state.selections.story !== '';
            case 3: return state.selections.style !== '';
            case 4: return state.selections.format !== '' && state.selections.size !== '';
            default: return true;
        }
    }
    
    // Initial display setup
    document.querySelectorAll('.journey-step').forEach((el, idx) => {
        if(idx !== 0) el.style.display = 'none';
        else el.style.display = 'block';
    });
});
