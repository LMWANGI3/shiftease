
let myCalendar = null;
const loginBtn = document.getElementById('loginBtn');
const loginPage = document.getElementById('loginPage');
const app = document.getElementById('app');
const employeeIdInput = document.getElementById('employeeId');
const passwordInput = document.getElementById('password');
const form = document.getElementById('card-form');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Hide login
  loginPage.classList.remove('page-active');

  // Show app
  app.style.display = 'block';

  // Open home page
  openPage('home-page');

  // Initialize calendar AFTER home page is visible
  setTimeout(() => {
    initCalendar();
  }, 50); // small delay to let layout settle
});

function initCalendar() {
  const calendarEl = document.getElementById("calendar");
  if (!calendarEl) return;

  if (!myCalendar) {
    myCalendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 'auto'
    });
    myCalendar.render();
  } else {
    // If already created, just re-render / update size
    myCalendar.updateSize();
  }
}

const arrowButton = document.querySelector('.arrow-button'); 
if(arrowButton){
 arrowButton.addEventListener('click',()=>{
     const swapItem= arrowButton.closest('.swap-item');
     swapItem.classList.toggle('open');
    });
}

const acceptBtn = document.querySelector('.accept-btn');
const declineBtn = document.querySelector('.decline-btn');
if(acceptBtn){
    acceptBtn.addEventListener('click',()=>{
        const swapItem = acceptBtn.closest('.swap-item');
        const swapText = swapItem.querySelector('.swap');
        alert('Swap accepted, waiting for approval');
        swapItem.style.display = 'none';

    const pendingSwaps = document.querySelector('#pendingSwapCounts');
    if(pendingSwaps){
        pendingSwaps.textContent = parseInt(pendingSwaps.textContent) + 1;
    }
    });
}
if(declineBtn){
    declineBtn.addEventListener('click',()=>{
        const swapItem = declineBtn.closest('.swap-item');
        alert('swap declined');
        swapItem.style.display = 'none';
    });  
}

const view = document.getElementById('view');  //get the element with the id view
if(view){    //check id the id exists
view.addEventListener('click',(e)=>{   //instruct what should happen if there's a click on the id
    e.preventDefault();       //this prevents reload
const hiddenActitity = document.querySelectorAll('.hidden-activity');   //check if there are any hidden activities
    hiddenActitity.forEach(task=>              //loops through each task as it toggles each available task.
        task.classList.toggle('show'));   //displays the task
});
}
const shiftsData = {
  lastWeek: [
    {date: "Mon 18 Jan",time: "6:00 – 3:00",break: "8:10 – 8:20", lunch: "10:50 – 11:30", overtime: "3:00 – 5:00" },
    {date: "Tue 19 Jan",time: "7:00 – 4:00",break: "8:20 – 8:30",lunch: "11:00 – 11:40",overtime: "4:00 – 5:30"},
    {date: "Wed 20 Jan", time: "-", break: "-", lunch: "-", overtime: "-", off: true },
    {date: "Thu 21 Jan",time: "6:00 – 3:00",break: "8:15 – 8:25",lunch: "11:00 – 11:30",overtime: "3:00 – 4:00"},
    {date: "Fri 22 Jan",time: "7:00 – 4:00", break: "8:20 – 8:30",lunch: "11:10 – 11:40",overtime: "4:00 – 6:00"},
    {date: "Sat 23 Jan", time: "-", break: "-", lunch: "-", overtime: "-", off: true },
    {date: "Sun 24 Jan",time: "6:00 – 3:00",break: "8:10 – 8:20",lunch: "10:50 – 11:30",overtime: "3:00 – 5:00"}
  ],

  currentWeek: [
    {
      date: "Mon 25 Jan",
      time: "7:00 – 4:00",
      break: "8:20 – 8:30",
      lunch: "11:00 – 11:40",
      overtime: "4:00 – 6:00"
    }
  ],
  nextWeek: [
    {
      date: "Mon 1 Feb",
      time: "6:00 – 3:00",
      overtime: "-"
    }
  ],
  weekPlus2: [
    {
      date: "Mon 8 Feb",
      time: "6:00 – 3:00",
      overtime: "3:00 – 4:00"
    }
  ]
};

function showShifts(selectedWeek) {
  const container = document.getElementById("shiftDisplay");
  container.innerHTML = "";

  shiftsData[selectedWeek].forEach((shift) => {
    const shiftRow = document.createElement("div");
    shiftRow.className = "shift-day";

    shiftRow.innerHTML = `
  <div class="shift-summary">
    <div class="shift-text">
      <div class="shift-date">${shift.date}</div>
      <div class="shift-time ${shift.off ? 'off-day' : ''}">
        ${shift.off ? "Off Day" : shift.time}
      </div>
    </div>

    <span class="direct-btn">&#9654;</span> <!-- just a small arrow -->
  </div>

  <div class="shift-info">
    <p><strong>Break:</strong> ${shift.break || "-"}</p>
    <p><strong>Lunch:</strong> ${shift.lunch || "-"}</p>
    <p><strong>Overtime:</strong> ${shift.overtime || "-"}</p>
  </div>
`;

    // Toggle dropdown
    const directBtn = shiftRow.querySelector(".direct-btn");
    const info = shiftRow.querySelector(".shift-info");

    directBtn.addEventListener("click", () => {
      info.classList.toggle("show");
      directBtn.classList.toggle("rotate");
    });

    container.appendChild(shiftRow);
  });
}
const weeksOrder = ["lastWeek", "currentWeek", "nextWeek", "weekPlus2"];
let currentWeekIndex = 0;

// Initial load
showShifts(weeksOrder[currentWeekIndex]);

// Click week card
document.querySelectorAll(".week-card").forEach((card, index) => {
  card.addEventListener("click", () => {
    setActiveWeek(index);
  });
});

// Arrow buttons
document.getElementById("prevWeek").addEventListener("click", () => {
  if (currentWeekIndex > 0) {
    setActiveWeek(currentWeekIndex - 1);
  }
});

document.getElementById("nextWeek").addEventListener("click", () => {
  if (currentWeekIndex < weeksOrder.length - 1) {
    setActiveWeek(currentWeekIndex + 1);
  }
});

// Core controller
function setActiveWeek(index) {
  currentWeekIndex = index;

  // update active card
  document.querySelectorAll(".week-card").forEach(card =>
    card.classList.remove("active")
  );
  document.querySelectorAll(".week-card")[index].classList.add("active");

  // load shifts
  showShifts(weeksOrder[index]);

  // arrow enable/disable
  document.getElementById("prevWeek").disabled = index === 0;
  document.getElementById("nextWeek").disabled = index === weeksOrder.length - 1;
}


const agents = [
            { id: 1, name: "Sarah Johnson", empId: "EK-23456", role: "Customer Service-line 100", available: true },
            { id: 2, name: "Emily Rodriguez", empId: "EK-45678", role: "Customer Service-line 200", available: true },
            { id: 3, name: "Jessica Williams", empId: "EK-67890", role: "Customer Service-sms support", available: false},
            { id: 4, name: "Michael Brown", empId: "EK-12345", role: "Customer Service-social media support", available: true },
            { id: 5, name: "David Chen", empId: "EK-34567", role: "Customer Service-email support", available: false },
            { id: 6, name: "Lisa Thompson", empId: "EK-78901", role: "Customer Service-line 400", available: true }
        ];

        // State variables
        let selectedShift = null;
        let selectedAgent = null;
        let filteredAgents = [...agents];

        // DOM Elements
        const step1Element = document.getElementById('step1');
        const step2Element = document.getElementById('step2');
        const step3Element = document.getElementById('step3');
        const successStepElement = document.getElementById('successStep');
        
        const shiftCards = document.querySelectorAll('.shift-card');
        const agentListElement = document.getElementById('agentList');
        const searchInput = document.getElementById('searchAgent');
        const continueToReviewBtn = document.getElementById('continueToReviewBtn');
        const backToStep2Btn = document.getElementById('backToStep2Btn');
        const sendRequestBtn = document.getElementById('sendRequestBtn');
        const newSwapBtn = document.getElementById('newSwapBtn');
        
        // Step 3 elements
        const yourShiftDateElement = document.getElementById('yourShiftDate');
        const yourShiftTimeElement = document.getElementById('yourShiftTime');
        const yourShiftRoleElement = document.getElementById('yourShiftRole');
        const swapAgentNameElement = document.getElementById('swapAgentName');
        const swapAgentIdElement = document.getElementById('swapAgentId');
        const swapAgentRoleElement = document.getElementById('swapAgentRole');
        const sentAgentNameElement = document.getElementById('sentAgentName');
        
        // Initialize the app
        function init() {
            console.log("Initializing app...");
            renderAgentList();
            
            // Step 1: Shift selection
            shiftCards.forEach(card => {
    card.addEventListener('click', function(e) {
        const clickedCard = e.currentTarget;
        
        console.log("=== DEBUG: CLICKED SHIFT CARD ===");
        console.log("Full card HTML:", clickedCard.outerHTML);
        console.log("All attributes:");
        for (let attr of clickedCard.attributes) {
            console.log(`  ${attr.name} = ${attr.value}`);
        }
        console.log("Dataset:", clickedCard.dataset);
        
        // Remove selected class from all cards
        shiftCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to clicked card
        clickedCard.classList.add('selected');
        
        // Get data - EXPLICITLY check all possible ways
        const shiftId = clickedCard.getAttribute('data-shift-id');
        const date = clickedCard.getAttribute('data-date');
        const time = clickedCard.getAttribute('data-time');
        const roleFromData = clickedCard.getAttribute('data-role');
        
        // ALSO try to get from the text inside the card
        const shiftDetails = clickedCard.querySelector('.shift-details');
        let roleFromText = '';
        if (shiftDetails) {
            const roleElement = shiftDetails.querySelector('.shift-role');
            if (roleElement) {
                roleFromText = roleElement.textContent.trim();
            }
        }
        
        selectedShift = {
            id: shiftId,
            date: date,
            time: time,
            // Use data-role first, then text content, then fallback
            role: roleFromData || roleFromText || "Unknown Role"
        };
        
        console.log("Selected shift object:", selectedShift);
        console.log("=== END DEBUG ===");
        
        // Show step 2
        step2Element.classList.remove('hidden');
        step2Element.scrollIntoView({ behavior: 'smooth' });
    });
});
            // Step 2: Search agents
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                filterAgents(searchTerm);
            });
            
            // Continue to review button
            continueToReviewBtn.addEventListener('click', function() {
    console.log("=== CONTINUE BUTTON CLICKED ===");
    console.log("Selected Shift to display:", selectedShift);
    console.log("Selected Agent to display:", selectedAgent);
    
    if (selectedAgent && selectedShift) {
        // FIRST: Show Step 3
        step2Element.classList.add('hidden');
        step3Element.classList.remove('hidden');
        
        console.log("Step 3 should now be visible");
        
        // Use a tiny delay to ensure DOM updates
        setTimeout(() => {
            // Get FRESH references to Step 3 elements (they're now visible)
            const dateEl = document.getElementById('yourShiftDate');
            const timeEl = document.getElementById('yourShiftTime');
            const roleEl = document.getElementById('yourShiftRole');
            
            console.log("Step 3 elements found:", {
                dateEl: dateEl ? "FOUND" : "NOT FOUND",
                timeEl: timeEl ? "FOUND" : "NOT FOUND", 
                roleEl: roleEl ? "FOUND" : "NOT FOUND"
            });
            
            // Update the elements with the selected shift data
            if (dateEl) {
                dateEl.textContent = selectedShift.date;
                console.log("Set date to:", selectedShift.date);
            }
            
            if (timeEl) {
                timeEl.textContent = selectedShift.time;
                console.log("Set time to:", selectedShift.time);
            }
            
            if (roleEl) {
                roleEl.textContent = selectedShift.role;
                console.log("Set role to:", selectedShift.role);
            }
            
            // Also update agent info
            document.getElementById('swapAgentName').textContent = selectedAgent.name;
            document.getElementById('swapAgentId').textContent = selectedAgent.empId;
            document.getElementById('swapAgentRole').textContent = selectedAgent.role;
            
            // Scroll to Step 3
            step3Element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            console.log("=== DISPLAY COMPLETE ===");
            console.log("Check Step 3 - data should be visible now");
        }, 50); // 50ms delay to ensure DOM updates
        
    } else {
        console.error("Missing data:", {selectedShift, selectedAgent});
        alert("Please select both a shift and an agent.");
    }
});
            
            // Back to step 2 button
            backToStep2Btn.addEventListener('click', function() {
                step3Element.classList.add('hidden');
                step2Element.classList.remove('hidden');
                step2Element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
            
            // Send request button
            sendRequestBtn.addEventListener('click', function() {
                // Update success message with agent name
                sentAgentNameElement.textContent = selectedAgent.name;
                
                // Show success step
                step3Element.classList.add('hidden');
                successStepElement.classList.remove('hidden');
                successStepElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
            
            // Start new swap button
            newSwapBtn.addEventListener('click', function() {
                // Reset the app
                resetApp();
            });
            
            // Initialize with step 1 visible
            step1Element.classList.remove('hidden');
            console.log("Step 1 should be visible now");
        }
        
        // Render agent list
        function renderAgentList() {
            agentListElement.innerHTML = '';
            
            filteredAgents.forEach(agent => {
                const agentCard = document.createElement('div');
                agentCard.className = 'agent-card';
                if (selectedAgent && selectedAgent.id === agent.id) {
                    agentCard.classList.add('selected');
                }
                
                agentCard.setAttribute('data-agent-id', agent.id);
                
                // Get initials for avatar
                const initials = agent.name.split(' ').map(name => name[0]).join('');
                
                agentCard.innerHTML = `
                    <div class="agent-avatar">${initials}</div>
                    <div class="agent-details">
                        <div class="agent-name">${agent.name}</div>
                        <div class="agent-id">${agent.empId}</div>
                        <div class="agent-role">${agent.role}</div>
                        ${agent.available ? '<div class="availability"><i class="fas fa-star"></i> Available</div>' : ''}
                    </div>
                `;
                
                agentCard.addEventListener('click', function() {
                    console.log("Agent clicked:", agent.name);
                    
                    // Remove selected class from all agent cards
                    document.querySelectorAll('.agent-card').forEach(card => {
                        card.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked card
                    this.classList.add('selected');
                    
                    // Store selected agent
                    selectedAgent = agent;
                    
                    console.log("Selected agent set to:", selectedAgent);
                    
                    // Enable continue button
                    continueToReviewBtn.disabled = false;
                });
                
                agentListElement.appendChild(agentCard);
            });
        }
        
        // Filter agents based on search term
        function filterAgents(searchTerm) {
            if (searchTerm === '') {
                filteredAgents = [...agents];
            } else {
                filteredAgents = agents.filter(agent => 
                    agent.name.toLowerCase().includes(searchTerm) || 
                    agent.empId.toLowerCase().includes(searchTerm) ||
                    agent.role.toLowerCase().includes(searchTerm)
                );
            }
            
            renderAgentList();
            
            // If an agent was previously selected but is no longer in the filtered list, deselect it
            if (selectedAgent && !filteredAgents.find(agent => agent.id === selectedAgent.id)) {
                selectedAgent = null;
                continueToReviewBtn.disabled = true;
            }
        }
        
        // Reset the app to initial state
        function resetApp() {
            // Reset state
            selectedShift = null;
            selectedAgent = null;
            filteredAgents = [...agents];
            
            // Reset UI
            shiftCards.forEach(card => card.classList.remove('selected'));
            searchInput.value = '';
            document.getElementById('messageBox').value = '';
            continueToReviewBtn.disabled = true;
            
            

            // Clear step 3 display values
            yourShiftDateElement.textContent = "";
            yourShiftTimeElement.textContent = "";
            yourShiftRoleElement.textContent = "";
            swapAgentNameElement.textContent = "";
            swapAgentIdElement.textContent = "";
            swapAgentRoleElement.textContent = "";
            
            // Show only step 1
            step2Element.classList.add('hidden');
            step3Element.classList.add('hidden');
            successStepElement.classList.add('hidden');
            step1Element.classList.remove('hidden');
            step1Element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Re-render agent list
            renderAgentList();
        }

// Try to force update one element
if (yourShiftDateElement) {
    yourShiftDateElement.textContent = "TEST - If you see this, elements work";
    console.log("Test text set!");
}
  init();

 const currentUser = "You"; // system user
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');

// Store posts and replies
let chatPosts = [];

// Helper: format timestamp
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2,'0')} ${ampm}`;
}

// Render all posts with replies
function renderChatPosts() {
    chatMessages.innerHTML = '';
    chatPosts.forEach((post, postIndex) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'chat-post';

        // Post HTML
        postDiv.innerHTML = `
            <div class="post-header">
                <span class="post-user">${post.user}</span>
                <span class="post-time">${post.time}</span>
            </div>
            <div class="post-message">${post.message}</div>
            <div class="replies" id="replies-${postIndex}"></div>
            <div class="reply-input-container">
                <input type="text" class="reply-input" placeholder="Write a reply..." />
                <button class="reply-btn">Reply</button>
            </div>
        `;

        chatMessages.appendChild(postDiv);

        // Render existing replies
        const repliesContainer = postDiv.querySelector(`#replies-${postIndex}`);
        post.replies.forEach(reply => {
            const replyDiv = document.createElement('div');
            replyDiv.className = 'reply-post';
            replyDiv.innerHTML = `
                <div class="reply-header">
                    <span class="reply-user">${reply.user}</span>
                    <span class="reply-time">${reply.time}</span>
                </div>
                <div class="reply-message">${reply.message}</div>
            `;
            repliesContainer.appendChild(replyDiv);
        });

        // Reply button functionality
        const replyBtn = postDiv.querySelector('.reply-btn');
        const replyInput = postDiv.querySelector('.reply-input');
        replyBtn.addEventListener('click', () => {
            const message = replyInput.value.trim();
            if (message === '') return;

            const timestamp = formatTime(new Date());
            const newReply = {
                user: currentUser,
                message: message,
                time: timestamp
            };

            post.replies.push(newReply);
            replyInput.value = '';
            renderChatPosts();
        });
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle posting new chat message
sendChatBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message === '') return;

    const timestamp = formatTime(new Date());
    const newPost = {
        user: currentUser,
        message: message,
        time: timestamp,
        replies: []
    };

    chatPosts.push(newPost);
    chatInput.value = '';
    renderChatPosts();
});

const navButtons = document.querySelectorAll(".nav-content button");
const pages = document.querySelectorAll(".page");


// Reset all nav buttons active state
function setActiveNav(button) {
  navButtons.forEach(btn => btn.classList.remove("active"));
  button.classList.add("active");
}

// Main page navigation function
function openPage(pageClass) {
  // Hide all pages
  pages.forEach(page => {
    page.style.display = "none";
    page.classList.remove("page-active");
  });

  // Show selected page
  const activePage = document.querySelector(`.${pageClass}`);
  if (!activePage) return;

  activePage.style.display = "block";
  activePage.classList.add("page-active");

  // Nav highlight
  const navButton = document.querySelector(
    `.nav-btn[data-page="${pageClass}"]`
  );
  if (navButton) setActiveNav(navButton);

  // Page-specific logic
  if (pageClass === "shifts-page") {
    showShifts("lastWeek");
  }

  if (pageClass === "home-page") {
    setTimeout(() => {
      initCalendar();
    }, 50);
  }
}

// ✅ Initial page load
document.addEventListener("DOMContentLoaded", () => {
  // Show login page immediately
  loginPage.style.display = 'block';
  loginPage.classList.add('page-active');
  
  // Hide app initially
  app.style.display = 'none';
});

  // Add click listeners to nav buttons
  navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const pageClass = btn.getAttribute("data-page");
    openPage(pageClass);
  });
});
