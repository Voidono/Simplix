'use client';

import { useLocale } from 'next-intl';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ENGLISH_CONTENT = `
# 🧠 The AI Startup among young founders in Vietnam: ChatGPT Wrappers, Competitions, and Hard Truths

*I’m not against ChatGPT wrappers*

— in fact, I embrace them as part of the future. Around the world, developers have taken OpenAI’s API and created incredible tools, pushing the boundaries of what AI can do. It’s inspiring to see how people are integrating AI into education, accessibility, productivity, and even creativity.

But Vietnam.We’re a sort of behind in the AI game.

Here, AI is still often seen as some mythical, holy grail technology. Especially among those with money and power, but little understanding of what AI actually is. The result? A wave of startups by young founders building **nothing more than a ChatGPT wrapper + chatbot UI** — and yet they dominate competitions like mosquitoes in rainy season.

I’ve joined just **two competitions for the YOUTH** so far, but the trend is obvious. Project after startup wins funding — **$20,000+ (around 500 million VND)**. No real backend, no innovation, no vision beyond "ask AI something and it replies."

## 🏆 When Innovation Loses to Hype

Let me give you a concrete example from a recent competition.

- The **Top 3 team** created a phone-based system for people who can't speak — using sign language recognition translated into speech. **They built the system from scratch**, which is an incredible technical and social achievement.
- The **Top 2 team**? A simple ChatGPT chatbot with DALL·E integration. Just a prettier wrapper. That’s it.
- And the **Top 1 winner**? A mental health chatbot... which we, at Apolumis, use instead of Chatgpt, because it gives us **good HTML and SQL code for free**. It’s basically an indirect way to access ChatGPT without paying for it. (This is a joke, btw, but we did try to ask for code and it did give us)

We respect these projects, of course. But let’s be honest — the level of depth, originality, and effort is not even close between Top 3 and the rest.

So why do the wrappers win?

Because the system is a bit spoiled. Flash over depth. It’s disheartening for people trying to build something truly impactful, especially when you're actually writing the code, solving the real problems, with or without OpenAI APIs.

## 💡 The Future We Should Be Building

ChatGPT is a tool — a powerful one — but **wrapping it in a chat interface isn’t a startup**. That’s a feature, not a product. We need to ask deeper questions:

- **What real problem are you solving?**
- **What happens when OpenAI changes its API or pricing?**
- **Are you building a moat, or just a demo?**

Vietnam has talent. But we need to stop glorifying shortcuts and start valuing depth. Otherwise, we’re training a generation of AI founders to build wrappers instead of solving real problems.
`;

const VIETNAMESE_CONTENT = `
# 🧠 Thực trạng AI startup trẻ tại Việt Nam: Bọc ChatGPT, các cuộc thi và một số điều thú vị

*Mình không phản đối các ứng dụng bọc quanh ChatGPT*

— thật ra, mình khá ủng hộ vì đó là một phần tương lai. Bởi nhiều người đang dùng API của OpenAI để tạo ra những điều tuyệt vời, đẩy ranh giới của AI lên một tầm cao mới ở khắp mọi nơi. Họ tích hợp AI vào giáo dục, hỗ trợ người khuyết tật, tăng năng suất làm việc và cả sáng tạo nghệ thuật.

Ở Việt Nam, có điều đó xảy ra, và đó là rất tốt… nhưng vẫn có một vài sự thiếu sót

Bởi, AI bây giờ vẫn được nhiều người nhìn như một loại công nghệ thần thánh. Nhất là trong mắt những người có tiền và quyền lực nhưng không hiểu gì về công nghệ. Kết quả là một làn sóng startup của giới trẻ mọc lên chỉ để tạo ra **một Chatbot bọc Chatgpt**, trông hào nhoáng nhưng rỗng tuếch — và chinh phục một loạt cuộc thi.

Mình mới tham gia **hai cuộc thi**, nhưng xu hướng đã quá rõ ràng, AI this, AI that. Một số startup nhận được tài trợ — tổng cộng hơn **500 triệu đồng (~20.000 USD)**. Không backend thực sự, không sáng tạo, không tầm nhìn nào khác ngoài "nhắn hỏi AI và nó trả lời."

## 🏆 Khi sáng tạo thua trước sự hào nhoáng

Một ví dụ cụ thể từ cuộc thi gần đây mình tham gia:

- **[Top 3]** tạo ra hệ thống nhận diện ngôn ngữ ký hiệu để giúp người khiếm thanh nói chuyện — họ **tự phát triển toàn bộ hệ thống**, một thành tựu lớn về cả kỹ thuật lẫn xã hội.
- **[Top 2]**? Một chatbot dùng ChatGPT kết hợp DALL·E. Giao diện đẹp, vậy thôi.
- **[Top 1]**? Một chatbot hỗ trợ tâm lý... mà chúng mình tại Apolumis vẫn đang dùng để lấy **code HTML và SQL miễn phí**. Một cách hài hước để dùng ChatGPT mà không phải trả tiền. ( Đây là 1 câu đùa, bọn mình chỉ test thử thôi, không dùng)

Mình tôn trọng mọi dự án. Nhưng phải nói thật — mức độ đầu tư, sáng tạo và chất lượng giữa Top 3 và Top 1, Top 2 là rất vô lý.

Tại sao các dự án đơn giản lại thắng?

Mình cũng không buồn nói tại sao, khi mà kết quả dường như đã được định sẵn, tiêu chí chấm không chuẩn chỉnh. Điều này làm nản lòng những ai thực sự muốn tạo ra điều gì đó có ý nghĩa, nhất là khi bạn là người trực tiếp viết code, giải quyết vấn đề, dù có dùng API của OpenAI hay không.

## 💡 Tương lai mà chúng ta nên xây dựng

ChatGPT là một công cụ mạnh mẽ — nhưng **chatbot với API của AI không phải là một startup**. Đó chỉ là một tính năng, không phải một sản phẩm. Chúng ta cần hỏi những câu sâu hơn:

- **Mình đang giải quyết vấn đề gì?**
- **Nếu OpenAI thay đổi API hoặc tăng giá thì liệu startup mình thế nào?**
- **Bạn có xây được lợi thế cạnh tranh thực sự, hay chỉ là một bản demo mà bất kể ai cũng có thể copy?**

Việt Nam không thiếu tài năng. Nhưng chúng ta cần ngừng thần thánh hóa lối tắt và bắt đầu trân trọng chiều sâu. Nếu không, chúng ta sẽ tạo ra cả một thế hệ "founder AI" chỉ biết làm chatbot bọc API.
`;

export default function Page() {
  const locale = useLocale();
  const content = locale === 'vi' ? VIETNAMESE_CONTENT : ENGLISH_CONTENT;

  return (
    <main className="prose prose-neutral tracking-wider leading-7 dark:prose-invert prose-lg max-w-3xl px-6 py-16 mx-auto">
      <article>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-4xl font-bold mt-0 mb-6">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
            ),
            p: ({ children }) => (
              <p className="my-4">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="my-4 pl-6">{children}</ul>
            ),
            li: ({ children }) => (
              <li className="my-2">{children}</li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold">{children}</strong>
            ),
          }}
        >
          {content}
        </Markdown>
      </article>
    </main>
  );
}