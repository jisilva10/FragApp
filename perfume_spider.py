import scrapy

class PerfumeSpider(scrapy.Spider):
    name = "perfume_spider"
    start_urls = ['https://www.fragrantica.com/perfume/Mugler/Alien-707.html']

    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'ROBOTSTXT_OBEY': False
    }

    def parse(self, response):
        title = response.css('title::text').get()
        
        yield {
            'title': title,
            'body_snippet': response.text[:200]
        }
