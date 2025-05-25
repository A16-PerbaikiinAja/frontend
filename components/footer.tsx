export default function Footer() {
  return (
    <footer className="border-t py-4 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">© 2025 PerbaikiinAja. All rights reserved.</span>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Terms
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Privacy
          </a>
          <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
