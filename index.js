const API_URL = "https://cfw-takehome.developers.workers.dev/api/variants"
const COOKIE = "URL"

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cookie = getCookie(request, COOKIE)
  if (cookie) return fetchWebPage(cookie)

  return fetchWebPage()
}

// Function to fetch random url out of 2 urls
async function fetchVariant() {
  const res = await fetch(API_URL)
  const data = await res.json()
  const urls = data.variants
  const randomIndex = Math.round(Math.random())

  return urls[randomIndex]
}

/*
Customizing the variant page 

title: the title of the web page, displayed on the window or tab title in your browser.
h1#title: the main title of the page. By default, this displays "Variant 1" or "Variant 2"
p#description: the description paragraph on the page. By default, this displays the text "This is variant X of the take home project!".
a#url: a Call to Action link with strong emphasis on the page.

*/

class Title {
  element(element) {
    element.prepend("Akanksha Singh ")
  }
}

class MainTitle {
  element(element) {
    element.prepend("This is ")
  }
}

class Description {
  element(element) {
    element.replace("Welcome! This is my submission for Cloudflare's Fullstack Internship 2020. Thank You!")
  }
}

class CallToAction {
  element(element) {
    element.setInnerContent("Connect with me here ")
    element.setAttribute("href", "https://www.linkedin.com/in/akankshasingh121224/")
  }
}

// Implementing cookie using Cloudflare's template gallery
function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get("Cookie")
  if (cookieString) {
    let cookies = cookieString.split(";")
    cookies.forEach((cookie) => {
      let cookieName = cookie.split("=")[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split("=")[1]
        result = cookieVal
      }
    })
  }
  return result
}
async function fetchWebPage(cookie = null) {
  const url = cookie ? cookie : await fetchVariant()
  const res = await fetch(url)
  const title = new Title()
  const maintitle = new MainTitle()
  const description = new Description()
  const cta = new CallToAction()
  const response = new HTMLRewriter()
    .on("title", title)
    .on("h1#title", maintitle)
    .on("p#description", description)
    .on("a#url", cta)
    .transform(res)

  if (!cookie) {
    response.headers.set("Set-Cookie", `${COOKIE}=${url}`)
  }

  return response
}