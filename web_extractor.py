
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; UPISafetyCoach/1.0)"
}


def extract_webpage(url):
    print(f"\nFetching: {url}")

    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=20
        )

        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Remove page elements that are not useful for our knowledge base
        for element in soup([
            "script",
            "style",
            "nav",
            "footer",
            "header",
            "noscript"
        ]):
            element.decompose()

        title = soup.title.get_text(
            strip=True
        ) if soup.title else urlparse(url).netloc

        main_content = soup.find("main") or soup.find("article") or soup.body

        if main_content:
            text = main_content.get_text(
                separator=" ",
                strip=True
            )
        else:
            text = ""

        if len(text) < 200:
            print("Warning: Very little readable content found.")
            return None

        print("Title:", title)
        print("Extracted characters:", len(text))
        print("Preview:", text[:500])

        return {
            "url": url,
            "title": title,
            "text": text
        }

    except requests.RequestException as error:
        print("Could not retrieve webpage:", error)
        return None


def main():
    urls_file = "knowledge_base/documents/source_urls.txt"

    with open(urls_file, "r", encoding="utf-8") as file:
        urls = [
            line.strip()
            for line in file
            if line.strip().startswith("https://")
        ]

    print(f"Found {len(urls)} source URLs.")

    successful = 0

    for url in urls:
        result = extract_webpage(url)

        if result:
            successful += 1

    print(f"\nSuccessfully extracted {successful}/{len(urls)} webpages.")


if __name__ == "__main__":
    main()
