import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Reply, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  profiles: {
    full_name: string | null;
  } | null;
}

interface CommentsProps {
  articleId: string;
}

export const Comments: React.FC<CommentsProps> = ({ articleId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          parent_id
        `)
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Get profile data separately to avoid relation issues
      const commentsWithProfiles = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', comment.user_id)
            .single();
          
          return {
            ...comment,
            profiles: profile
          };
        })
      );
      
      setComments(commentsWithProfiles);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const submitComment = async () => {
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          content: newComment.trim(),
          is_approved: false // Requires admin approval
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: "Comment submitted",
        description: "Your comment is pending approval and will appear shortly.",
      });
      
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitReply = async () => {
    if (!user || !replyContent.trim() || !replyTo) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          content: replyContent.trim(),
          parent_id: replyTo,
          is_approved: false
        });

      if (error) throw error;

      setReplyContent('');
      setReplyTo(null);
      toast({
        title: "Reply submitted",
        description: "Your reply is pending approval and will appear shortly.",
      });
      
      fetchComments();
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Error",
        description: "Failed to submit reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const topLevelComments = comments.filter(c => !c.parent_id);
  const getReplies = (commentId: string) => comments.filter(c => c.parent_id === commentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <MessageCircle className="h-5 w-5" />
        Comments ({comments.length})
      </div>

      {/* Comment Form */}
      {user ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Leave a Comment</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
              />
              <Button 
                onClick={submitComment} 
                disabled={loading || !newComment.trim()}
              >
                {loading ? 'Submitting...' : 'Submit Comment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Please <a href="/login" className="text-primary hover:underline">log in</a> to leave a comment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {topLevelComments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(comment.profiles?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.profiles?.full_name || 'Anonymous User'}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  )}

                  {/* Reply Form */}
                  {replyTo === comment.id && (
                    <div className="mt-4 space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={submitReply} disabled={loading || !replyContent.trim()}>
                          Submit Reply
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setReplyTo(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className="ml-8 mt-4 border-l-2 border-muted pl-4">
                      <div className="flex gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(reply.profiles?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {reply.profiles?.full_name || 'Anonymous User'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(reply.created_at)}
                            </span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {comments.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No comments yet. Be the first to share your thoughts!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};