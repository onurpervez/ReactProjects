interface Props {
  message: string
}

function ErrorMessage({ message }: Props) {
  return (
    <div>
      <p>⚠️ {message}</p>
    </div>
  )
}

export default ErrorMessage