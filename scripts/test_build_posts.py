"""Tests for the Medium import. Run with: python3 -m unittest discover -s scripts"""
import pathlib
import sys
import unittest

import feedparser

sys.path.insert(0, str(pathlib.Path(__file__).parent))
import build_posts  # noqa: E402

BODY = " ".join(["word"] * 920)

# Shaped like a Medium feed item: category tags, dc:creator, full story in content:encoded.
FEED = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
<channel><title>My Climate Definition</title>
<item>
  <title>Has Plastic Ever Truly Been Part of the Climate Conversation?</title>
  <link>https://medium.com/@myclimatedefinition/plastic</link>
  <category>plastic-pollution</category>
  <category>climate-change</category>
  <dc:creator>My Climate Definition</dc:creator>
  <pubDate>Thu, 18 Sep 2025 19:46:14 GMT</pubDate>
  <content:encoded><![CDATA[<h3>The Plastic Paradox</h3><figure><img src="https://cdn-images-1.medium.com/x.png"><figcaption>Photo created on Canva</figcaption></figure><p>By Patricia Korir</p><p>Did you know that the first plastic was inspired by a <strong>$10,000</strong> reward?</p><p>{BODY}</p>]]></content:encoded>
</item>
</channel></rss>"""


class MediumEntryTest(unittest.TestCase):
    def setUp(self):
        self.entry = feedparser.parse(FEED).entries[0]
        self.markup = build_posts.entry_markup(self.entry)

    def test_excerpt_starts_with_the_story(self):
        self.assertTrue(build_posts.excerpt_text(self.markup).startswith(
            "Did you know that the first plastic was inspired by a $10,000 reward?"))

    def test_writer_comes_from_the_byline(self):
        self.assertEqual(build_posts.byline_name(self.markup), "Patricia Korir")

    def test_no_writer_without_a_byline(self):
        self.assertEqual(build_posts.byline_name("<p>Opening sentence.</p><p>By the way, more.</p>"), "")

    def test_topics_come_from_categories(self):
        self.assertEqual([t.term for t in self.entry.tags], ["plastic-pollution", "climate-change"])

    def test_reading_time_from_the_full_story(self):
        self.assertEqual(build_posts.reading_minutes(self.markup), 4)
        self.assertEqual(build_posts.reading_minutes(""), 0)


if __name__ == "__main__":
    unittest.main()
