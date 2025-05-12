// Store jobs in localStorage
let jobs = JSON.parse(localStorage.getItem('jobs')) || [];

// Function to show/hide job form
function toggleJobForm() {
    const jobForm = document.getElementById('post-job');
    if (jobForm) {
        jobForm.classList.toggle('hidden');
        jobForm.classList.toggle('flex');
    }
}

function closeJobForm() {
    const jobForm = document.getElementById('post-job');
    if (jobForm) {
        jobForm.classList.add('hidden');
        jobForm.classList.remove('flex');
    }
}

// Function to create a job card
function createJobCard(job) {
    return `
        <div class="bg-darker rounded-xl p-6 border border-gray-800 hover:border-primary/30 transition-all duration-300">
            <h3 class="text-xl font-bold text-white mb-2">${job.title}</h3>
            <p class="text-gray-400 mb-4">${job.company} • ${job.location}</p>
            <p class="text-gray-400 mb-6">${job.description}</p>
            <a href="${job.applyLink}" target="_blank" class="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-light transition duration-300">
                Apply Now
            </a>
        </div>
    `;
}

// Function to render all jobs
function renderJobs() {
    const jobListings = document.getElementById('job-listings');
    if (jobListings) {
        jobListings.innerHTML = jobs.map(job => createJobCard(job)).join('');
    }
}

// Initial render
document.addEventListener('DOMContentLoaded', renderJobs);