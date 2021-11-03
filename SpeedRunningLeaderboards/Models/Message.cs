using System;

namespace SpeedRunningLeaderboards.Models
{
	public class Message
	{
		public Runner Poster { get; private set; }
		public DateTime PublishDate { get; private set; }
		public string Content { get; private set; }

		public Message(Runner poster, DateTime publishDate, string content)
		{
			Poster = poster;
			PublishDate = publishDate;
			Content = content;
		}
	}
}