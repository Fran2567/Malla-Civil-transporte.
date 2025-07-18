/* -------------------------------------------------
   script.js – Lógica de la malla interactiva
   ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const courses = Array.from(document.querySelectorAll('.course'));
  const STORAGE_KEY = 'mallaPUCV.aprobados';

  const approvedSet = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));

  function updateLocks() {
    courses.forEach(course => {
      const id = course.dataset.id;
      const prereqs = (course.dataset.prereqs || '').split(',').filter(Boolean);
      const allMet = prereqs.every(pr => approvedSet.has(pr));
      if (allMet) {
        course.classList.remove('is-locked');
      } else {
        course.classList.add('is-locked');
        if (approvedSet.has(id)) {
          approvedSet.delete(id);
          course.classList.remove('is-approved');
        }
      }
    });
  }

  function renderApproved() {
    courses.forEach(course => {
      const id = course.dataset.id;
      course.classList.toggle('is-approved', approvedSet.has(id));
    });
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(approvedSet)));
  }

  updateLocks();
  renderApproved();

  courses.forEach(course => {
    course.addEventListener('click', () => {
      if (course.classList.contains('is-locked')) return;
      const id = course.dataset.id;
      approvedSet.has(id) ? approvedSet.delete(id) : approvedSet.add(id);
      renderApproved();
      updateLocks();
      persist();
    });
    course.tabIndex = 0;
    course.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        course.click();
      }
    });
  });
});
