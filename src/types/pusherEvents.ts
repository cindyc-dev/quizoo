export interface PlayerJoinLeaveEvent {
  username: string;
  time: Date;
}

export interface PlayerEmoteEvent {
  username: string;
  emote: string;
}