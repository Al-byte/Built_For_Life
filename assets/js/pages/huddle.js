/**
 * BFL page module: huddle
 * Frontend prototype only — not an authenticated backend.
 */
import { initializeNavigation } from '../navigation.js';
import { byId as el, escapeHtml, cloneData as copy, showToast } from '../common.js';
import { readJson, writeJson } from '../storage.js';

initializeNavigation('huddle');

(() => {
  'use strict';
  // All content is fictitious or browser-local demo content. There is no network backend.
  const STORAGE_KEY = 'bfl-huddle-prototype-v1';
  const defaultPosts = [
    {
      id:'welcome',author:'Coach Rodney',role:'Program director · 2 days ago',category:'announcements',
      title:'Welcome to the Built For Life community',
      body:'This is a place to grow together. Share your effort, celebrate someone else, and ask for support.\nOur standard: be respectful, protect each other’s privacy, and show up with purpose.',
      likes:8,liked:false, replies:[{author:'Demo parent',text:'Love the focus on effort and accountability. Ready for this week!'}]
    },
    {
      id:'weekly',author:'Coach Rodney',role:'Program director · Yesterday',category:'weekly-challenge',
      title:'What does showing up look like this week?',
      body:'A gift is a starting point. Production is what you do with it. Share one small action you will repeat this week to put your gifts to work.',
      likes:5,liked:false,replies:[]
    }
  ];


let posts = copy(defaultPosts), activeFilter = 'all', openReplyId = null;
  try {
    const saved = readJson(STORAGE_KEY);
    if (Array.isArray(saved) && saved.length <= 100 && saved.every(p => p && typeof p.id === 'string' && typeof p.title === 'string' && Array.isArray(p.replies))) {
      posts = saved;
    }
  } catch(_) { /* Storage may be disabled; in-memory mode still works. */ }
  function persist() { writeJson(STORAGE_KEY, posts); }
  const toast = message => showToast(el('bflHuddleToast'), { messageElement: el('bflHuddleToastText'), message, delay: 2800 });
  function categoryLabel(kind) { return kind==='announcements'?'Announcements':kind==='weekly-challenge'?'Weekly challenge':'Conversation'; }
  function render() {
    document.querySelectorAll('.bfl-huddle-tab').forEach(tab => {
      const on = tab.dataset.filter===activeFilter;
      tab.setAttribute('aria-selected', String(on)); tab.tabIndex=on?0:-1;
    });
    const subset = activeFilter==='all'?posts:posts.filter(p=>p.category===activeFilter);
    el('bflPostList').innerHTML = subset.length ? subset.map(post => {
      const isCoach = post.author==='Coach Rodney';
      const safeId=escapeHtml(post.id);
      const replies=Array.isArray(post.replies)?post.replies:[];
      const replyTitle=replies.length===1?'1 Reply':`${replies.length} Replies`;
      const category=post.category==='announcements'?'announcements':post.category==='weekly-challenge'?'weekly-challenge':'general';
      return `<article class="bfl-huddle-post" id="bfl-post-${safeId}">
        <div class="bfl-huddle-post-header">
          <div class="bfl-huddle-author"><span class="bfl-huddle-author-avatar ${isCoach?'':'member'}" aria-hidden="true">${isCoach?'BFL':'JC'}</span>
            <div><p class="bfl-huddle-author-name">${escapeHtml(post.author)}</p><p class="bfl-huddle-author-meta">${escapeHtml(post.role)}</p></div></div>
          <span class="bfl-huddle-tag ${category==='weekly-challenge'?'challenge':category==='general'?'general':''}">${categoryLabel(category)}</span>
        </div>
        <h2>${escapeHtml(post.title)}</h2>
        <p class="bfl-huddle-body">${escapeHtml(post.body)}</p>
        ${post.id==='welcome' && replies.length?`<div class="bfl-huddle-reply-preview"><strong>${escapeHtml(replies[0].author)}</strong><p>${escapeHtml(replies[0].text)}</p></div>`:''}
        <div class="bfl-huddle-post-actions">
          <button class="bfl-huddle-reaction" type="button" data-action="like" data-id="${safeId}" aria-pressed="${post.liked?'true':'false'}" aria-label="${post.liked?'Remove encouragement from':'Encourage'} ${escapeHtml(post.title)}"><i class="bi bi-${post.liked?'heart-fill':'heart'}" aria-hidden="true"></i><span>${Math.max(0,Number(post.likes)||0)} Encouraged</span></button>
          <button class="bfl-huddle-reply-link" type="button" data-action="reply" data-id="${safeId}" aria-expanded="${openReplyId===post.id?'true':'false'}"><i class="bi bi-chat" aria-hidden="true"></i><span>${replyTitle} · Add yours</span></button>
        </div>
        ${openReplyId===post.id?`<div class="bfl-huddle-replies" id="bflReplies-${safeId}">
          <div class="bfl-huddle-replies-list">${replies.map(reply=>`<div class="bfl-huddle-reply-preview"><strong>${escapeHtml(reply.author)}</strong><p>${escapeHtml(reply.text)}</p></div>`).join('')||'<p class="small text-secondary mb-0">Be the first to reply.</p>'}</div>
          <form class="bfl-huddle-reply-form" data-action="submit-reply" data-id="${safeId}">
            <label for="bflReplyInput-${safeId}">Add a supportive reply</label>
            <textarea id="bflReplyInput-${safeId}" name="reply" required minlength="2" maxlength="700" placeholder="Write a thoughtful response..."></textarea>
            <button class="bfl-huddle-dark-button" type="submit">Post reply <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
          </form>
        </div>`:''}
      </article>`;
    }).join('') : '<div class="bfl-huddle-empty"><i class="bi bi-chat-dots fs-2 d-block mb-2"></i>No conversations in this category yet.</div>';
  }
  function setFilter(value) {activeFilter=value;openReplyId=null;render();}
  document.querySelectorAll('.bfl-huddle-tab').forEach(tab => tab.addEventListener('click',()=>setFilter(tab.dataset.filter)));
  el('bflPostList').addEventListener('click', event => {
    const button=event.target.closest('button[data-action]'); if(!button) return;
    const post=posts.find(p=>p.id===button.dataset.id); if(!post) return;
    if(button.dataset.action==='like') {post.liked=!post.liked;post.likes=Math.max(0,Number(post.likes)||0)+(post.liked?1:-1);persist();render();}
    if(button.dataset.action==='reply') { openReplyId=openReplyId===post.id?null:post.id;render(); if(openReplyId)el('bflReplyInput-'+post.id)?.focus(); }
  });
  el('bflPostList').addEventListener('submit', event => {
    const form=event.target.closest('form[data-action="submit-reply"]'); if(!form)return;
    event.preventDefault();if(!form.reportValidity())return;
    const post=posts.find(p=>p.id===form.dataset.id);if(!post)return;
    const response=form.elements.reply.value.trim();if(response.length<2)return;
    if(!Array.isArray(post.replies))post.replies=[];
    post.replies.push({author:'Jordan Carter',text:response.slice(0,700)}); persist();render();
    el('bfl-post-'+post.id)?.scrollIntoView({behavior:'smooth',block:'nearest'});toast('Demo reply added to this browser.');
  });
  el('bflPostForm').addEventListener('submit', event => {
    event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;
    const title=el('bflPostTitle').value.trim(),body=el('bflPostBody').value.trim();
    if(title.length<3||body.length<5)return;
    const category=el('bflPostCategory').value==='weekly-challenge'?'weekly-challenge':'general';
    posts.unshift({id:'demo-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),author:'Jordan Carter',role:'Demo participant · Just now',category,title:title.slice(0,120),body:body.slice(0,1200),likes:0,liked:false,replies:[]});
    persist();setFilter('all');form.reset();bootstrap.Modal.getOrCreateInstance(el('bflNewPostModal')).hide();
    el('bflPostList').scrollIntoView({behavior:'smooth',block:'start'});toast('Demo conversation created in this browser.');
  });
  const replyModal = bootstrap.Modal.getOrCreateInstance(el('bflReplyModal'));
  el('bflJoinConversation').addEventListener('click', () => {
    const post = posts.find(p => p.id === 'weekly');
    if (!post) { toast('The featured conversation is unavailable.'); return; }
    el('bflReplyTopic').textContent = post.title;
    el('bflReplyError').hidden = true;
    replyModal.show();
  });
  el('bflReplyModal').addEventListener('shown.bs.modal', () => el('bflReplyText').focus());
  el('bflReplyForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const text = el('bflReplyText').value.trim();
    if (text.length < 2) {
      el('bflReplyError').textContent = 'Please enter a reply of at least two characters.';
      el('bflReplyError').hidden = false;
      return;
    }
    const post = posts.find(p => p.id === 'weekly');
    if (!post) return;
    post.replies.push({author: 'Jordan Carter', text: text.slice(0, 700)});
    if (!writeJson(STORAGE_KEY, posts)) {
      post.replies.pop();
      el('bflReplyError').textContent = 'Your reply could not be saved in this browser. Please try again.';
      el('bflReplyError').hidden = false;
      return;
    }
    activeFilter = 'all';
    openReplyId = 'weekly';
    render();
    form.reset();
    replyModal.hide();
    toast('Demo reply saved in this browser.');
  });
  render();
})();
