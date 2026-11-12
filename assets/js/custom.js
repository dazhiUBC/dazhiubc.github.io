/* Accessible navigation and small enhancements for Dimension. */
(function () {
  'use strict';
  var filters = document.querySelectorAll('[data-filter]');
  filters.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.dataset.filter;
      filters.forEach(function (item) {
        var selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      document.querySelectorAll('[data-group]').forEach(function (group) {
        group.hidden = value !== 'all' && group.dataset.group !== value;
      });
      document.getElementById('filter-status').textContent = value === 'all' ? 'Showing all 18 papers and preprints.' : value === 'first' ? 'Showing 4 first-author papers and preprints.' : 'Showing 14 co-authored papers and preprints.';
    });
  });
  var copy = document.getElementById('copy-email');
  copy.addEventListener('click', async function () {
    var status = document.getElementById('copy-status');
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText('dzhou.astro@gmail.com');
      } else {
        var input = document.createElement('textarea');
        input.value = 'dzhou.astro@gmail.com';
        input.style.position = 'fixed'; input.style.opacity = '0';
        document.body.appendChild(input); input.select();
        var success = document.execCommand('copy'); input.remove(); copy.focus();
        if (!success) throw new Error('Copy unavailable');
      }
      status.textContent = 'Copied';
    } catch (error) { status.textContent = 'Select the email address above to copy.'; }
  });
  var main = document.getElementById('main'), lastTrigger = null, previous = null, timer;
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (link && !main.contains(link)) lastTrigger = link;
  });
  new MutationObserver(function () {
    var active = main.querySelector('article.active');
    if (active === previous) return;
    previous = active; clearTimeout(timer);
    if (active) {
      timer = setTimeout(function () { active.querySelector('h2').focus({preventScroll:true}); }, 100);
    } else {
      timer = setTimeout(function () {
        if (!main.querySelector('article.active') && lastTrigger) lastTrigger.focus({preventScroll:true});
      }, 450);
    }
  }).observe(main, {attributes:true,subtree:true,attributeFilter:['class']});
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    var active = main.querySelector('article.active'); if (!active) return;
    var nodes = Array.from(active.querySelectorAll('a[href],button:not([disabled]),[tabindex="0"]')).filter(function (node) {return node.getClientRects().length > 0;});
    if (!nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length-1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === active.querySelector('h2'))) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  });
})();
