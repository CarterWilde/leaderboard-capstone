﻿using System;
using System.Text.Json.Serialization;

namespace SpeedRunningLeaderboards.Models
{
	public class Message
	{
		[JsonPropertyName("chatId")]
		public Guid ChatID { get; set; }
		[JsonPropertyName("poster")]
		public Runner Poster { get; private set; }
		[JsonPropertyName("publishDate")]
		public DateTime PublishDate { get; private set; }

		[JsonPropertyName("content")]
		public string Content { get; private set; }

		public Message(Guid chatId, Runner poster, DateTime publishDate, string content)
		{
			ChatID = chatId;
			Poster = poster;
			PublishDate = publishDate;
			Content = content;
		}
	}
}