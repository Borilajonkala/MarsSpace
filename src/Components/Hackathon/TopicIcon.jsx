import {
  LuBot,
  LuGraduationCap,
  LuLanguages,
  LuLeaf,
  LuRocket,
  LuShoppingCart,
} from 'react-icons/lu'

const ICONS = {
  bot: LuBot,
  education: LuGraduationCap,
  eco: LuLeaf,
  language: LuLanguages,
  shop: LuShoppingCart,
  rocket: LuRocket,
}

const TopicIcon = ({ name, ...props }) => {
  const Icon = ICONS[name] || LuRocket
  return <Icon aria-hidden="true" {...props} />
}

export default TopicIcon
