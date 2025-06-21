import { Button } from "./ui/button";

// app/components/Helpline.tsx
export default function Helpline() {
  return (
    <div className="bg-red-100 p-4 border-l-4 border-red-500 text-red-700">
      <strong>⚠️ It seems you're going through something tough.</strong>
      <p>
        If you're in danger or in emotional distress, please reach out to a real person.
        <br />
        📞 Call: <Button className=" border-2 rounded-2xl border-red-700 bg-red-300 text-black hover:bg-red-700 hover:text-white">1-800-123-4567</Button> (Mock Hotline)
      </p>
    </div>
  );
}
