import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { useTrips } from '../../context/TripContext';
import { ThumbsUp, ThumbsDown, MessageSquare, Plus } from 'lucide-react';
import { clsx } from 'clsx';

export const CollaborationView = () => {
  const { activeTrip, voteOnGroupActivity, showNotification } = useTrips();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [currentVoteItem, setCurrentVoteItem] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);
  const [suggestionTitle, setSuggestionTitle] = useState('');

  const crew = activeTrip?.crew || [];
  const votes = activeTrip?.groupVotes || [];
  const feed = activeTrip?.activityFeed || [];

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    showNotification(`Invitation sent to ${inviteEmail}`, 'success');
    setInviteEmail('');
    setInviteModalOpen(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    showNotification(`Comment posted on ${currentVoteItem?.activityName}`, 'success');
    setCommentText('');
    setCommentModalOpen(false);
  };

  const handleAddSuggestion = (e) => {
    e.preventDefault();
    if (!suggestionTitle.trim()) return;
    showNotification(`Alternative suggestion added: ${suggestionTitle}`, 'success');
    setSuggestionTitle('');
    setSuggestionModalOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 text-left relative z-10">
      {/* Top Header & Crew with Liquid Glass */}
      <div className="glass-primary rounded-3xl p-6 sm:p-8 shadow-xl border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-600 dark:text-zinc-400">
              SOCIAL CO-PLANNING
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
              PLAN TOGETHER
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mt-1">
              Collaborate on activities, vote on group dining, and manage crew permissions.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setInviteModalOpen(true)}
            className="font-bold text-xs shadow-md"
          >
            + Invite Crew Member
          </Button>
        </div>

        {/* Travel Crew List */}
        <div>
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block mb-3">
            TRAVEL CREW ({crew.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {crew.map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-2xl glass-secondary border flex items-center gap-3 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white/70 dark:bg-zinc-700 border flex items-center justify-center text-xl shrink-0 shadow-xs">
                  {member.avatar}
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-bold text-zinc-950 dark:text-zinc-100 truncate">
                    {member.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant={member.role === 'Owner' ? 'dark' : 'outline'} size="sm">
                      {member.role}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Group Decisions / Voting Left + Live Activity Feed Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Group Decisions / Voting (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
              Group Decisions & Activity Votes
            </h3>
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => setSuggestionModalOpen(true)}
              className="text-xs font-bold"
            >
              Suggest Alternative
            </Button>
          </div>

          {votes.map((item) => (
            <div
              key={item.id}
              className="glass-secondary rounded-3xl p-6 shadow-md space-y-4 border"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase">
                      {item.category} • 📍 {item.location}
                    </span>
                    {item.isPopular && (
                      <Badge variant="warning" size="sm">
                        ★ Popular with your group
                      </Badge>
                    )}
                  </div>
                  <h4 className="text-base sm:text-lg font-black tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
                    {item.activityName}
                  </h4>
                </div>

                <Badge
                  variant={
                    item.status === 'Accepted'
                      ? 'success'
                      : item.status === 'Rejected'
                      ? 'outline'
                      : 'warning'
                  }
                >
                  {item.status}
                </Badge>
              </div>

              {/* Vote Visual Bar */}
              <div className="p-3 rounded-2xl glass-primary border flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <ThumbsUp className="w-4 h-4" /> {item.upvotes} Votes
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <ThumbsDown className="w-4 h-4" /> {item.downvotes} Votes
                  </span>
                </div>

                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {item.commentsCount} comments
                </span>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200/50 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => voteOnGroupActivity(item.id, 'up')}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs',
                      item.userVoted === 'up'
                        ? 'bg-emerald-600 text-white'
                        : 'glass-secondary text-zinc-800 dark:text-zinc-200 hover:bg-emerald-50 hover:text-emerald-700'
                    )}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" /> Vote Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => voteOnGroupActivity(item.id, 'down')}
                    className={clsx(
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs',
                      item.userVoted === 'down'
                        ? 'bg-rose-600 text-white'
                        : 'glass-secondary text-zinc-800 dark:text-zinc-200 hover:bg-rose-50 hover:text-rose-700'
                    )}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" /> Vote No
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={MessageSquare}
                  onClick={() => {
                    setCurrentVoteItem(item);
                    setCommentModalOpen(true);
                  }}
                  className="text-xs font-bold"
                >
                  Comment
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Activity Feed (4 Cols) */}
        <div className="lg:col-span-4 glass-secondary rounded-3xl p-6 shadow-md border">
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-zinc-600 dark:text-zinc-400 block mb-4">
            LIVE ACTIVITY FEED
          </span>

          <div className="space-y-4">
            {feed.map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-2xl glass-primary border text-xs text-left shadow-xs"
              >
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 font-mono text-[10px] mb-1">
                  <span>{act.time}</span>
                </div>
                <p className="text-zinc-800 dark:text-zinc-200 font-medium">
                  <strong className="text-zinc-950 dark:text-zinc-50">{act.user}</strong> {act.action}{' '}
                  <span className="font-bold text-zinc-950 dark:text-zinc-50 underline">
                    {act.target}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Travel Crew"
        subtitle="Invite friends or co-travelers to view, edit and vote on this itinerary."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSendInvite} className="flex flex-col gap-4 text-left">
          <Input
            label="Email Address"
            type="email"
            placeholder="traveler@email.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={commentModalOpen}
        onClose={() => setCommentModalOpen(false)}
        title={`Comment on ${currentVoteItem?.activityName || 'Activity'}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddComment} className="flex flex-col gap-4 text-left">
          <Input
            label="Your Thoughts / Dietary note"
            placeholder="e.g. Great idea, make sure they have vegetarian options!"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
            <Button variant="outline" onClick={() => setCommentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Post Comment
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={suggestionModalOpen}
        onClose={() => setSuggestionModalOpen(false)}
        title="Suggest Alternative Activity"
        subtitle="Pitch an experience for the group to vote on."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSuggestion} className="flex flex-col gap-4 text-left">
          <Input
            label="Activity Name"
            placeholder="e.g. Kyoto Craft Gin Distillery Tour"
            value={suggestionTitle}
            onChange={(e) => setSuggestionTitle(e.target.value)}
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/60 dark:border-zinc-800">
            <Button variant="outline" onClick={() => setSuggestionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Suggestion
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
