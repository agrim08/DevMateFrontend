import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Link } from "react-router-dom"

const EmptyState = ({ icon: Icon, title, description, buttonText, buttonLink, children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="text-center p-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          {buttonText && buttonLink && (
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to={buttonLink}>{buttonText}</Link>
            </Button>
          )}
          {children}
        </CardContent>
      </Card>
    </div>
  )
}

export default EmptyState