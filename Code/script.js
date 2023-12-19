document.addEventListener('DOMContentLoaded', function () {
  displayCurrentDay();
  generateTimeBlocks();
  loadEvents();
  attachEventListeners();
});

function displayCurrentDay() {
  const currentDayElement = document.getElementById('currentDay');
  currentDayElement.textContent = dayjs().format('dddd, MMMM D, YYYY');
}

function generateTimeBlocks() {
  const timeBlockContainer = document.querySelector('.time-block-container');
  for (let hour = 9; hour <= 17; hour++) {
    let timeBlock = createTimeBlock(hour);
    timeBlockContainer.appendChild(timeBlock);
  }
}

function createTimeBlock(hour) {
  const isPast = hour < dayjs().hour();
  const isPresent = hour === dayjs().hour();
  const isFuture = hour > dayjs().hour();

  const timeBlock = document.createElement('article');
  timeBlock.className = `row time-block ${isPast ? 'past' : isPresent ? 'present' : isFuture ? 'future' : ''}`;
  timeBlock.id = `hour-${hour}`;

  const timeElement = document.createElement('time');
  timeElement.className = 'col-2 col-md-1 hour text-center py-3';
  timeElement.setAttribute('datetime', `${hour}:00`);
  timeElement.textContent = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`;

  const textarea = document.createElement('textarea');
  textarea.className = 'col-8 col-md-10 description';
  textarea.rows = 3;
  textarea.setAttribute('aria-label', `Event at ${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`);

  const button = document.createElement('button');
  button.className = 'btn saveBtn col-2 col-md-1';
  button.setAttribute('aria-label', `Save event at ${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`);
  button.innerHTML = '<i class="fas fa-save" aria-hidden="true"></i>';

  timeBlock.appendChild(timeElement);
  timeBlock.appendChild(textarea);
  timeBlock.appendChild(button);

  return timeBlock;
}

function loadEvents() {
  for (let hour = 9; hour <= 17; hour++) {
    const eventText = localStorage.getItem(`event-${hour}`);
    if (eventText) {
      const textarea = document.querySelector(`#hour-${hour} .description`);
      textarea.value = eventText;
    }
  }
}

function attachEventListeners() {
  document.querySelectorAll('.saveBtn').forEach(button => {
    button.addEventListener('click', function (event) {
      const hourBlock = event.target.closest('.time-block');
      const hour = hourBlock.id.split('-')[1];
      const textarea = hourBlock.querySelector('.description');
      const eventText = textarea.value.trim();
      localStorage.setItem(`event-${hour}`, eventText);
    });
  });
}

// Update time blocks every minute to ensure accuracy
setInterval(generateTimeBlocks, 60000);
