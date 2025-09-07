import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="flex flex-row items-center justify-between p-4 border bg-orange-800">
      {/* Add logo stuff here */}
      <div>
        <Link href="/">PAWS logo</Link>
      </div>
      {/* nav links */}
      <div className="flex flex-row items-center justify-end space-x-8">
        <div>
          <Link href="/drive">Drive Files</Link>
        </div>
        <div>
          <Link href="/pets">View Pets</Link>
        </div>
        <div>
          <Link href="/about-us">About us</Link>
        </div>
        <div>
          <Link href="/contact-us">Contact</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
