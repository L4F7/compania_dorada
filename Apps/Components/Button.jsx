import { Text, TouchableOpacity } from 'react-native'

export default function Button({ onPress, title, bgColor, width = '', disabled = false}) {

  const style = `bg-${bgColor} p-4 rounded-full mt-4 ${width}`

  return (
    <TouchableOpacity
      onPress={onPress}
      className={style}
      disabled={disabled}
    >
      <Text className="text-white text-center text-[18px]">
        {title}
      </Text>
    </TouchableOpacity>
  )
}