import { Component } from 'react'

let refs = []

export const rewind = () => {
  const res = refs.reduce((acc, el) => ({ ...acc, ...el.props }), {})
  return res
}

const Wrapper = ({ children }) => {
  if (typeof window !== 'undefined') {
    const titleChild = children.find(({ type }) => type === 'title')
    if (titleChild) {
      const title = titleChild.props.children
      if (title !== document.title) {
        document.title = title
      }
    }
    return null
  } else {
    return <div>{children}</div>
  }
}

export default class Helmet extends Component {
  constructor (props) {
    super(props)
    refs.push(this)
  }

  componentWillUnmount () {
    const newRefs = refs.filter(c => c !== this)
    refs = newRefs
    document.title = this._getTitle({})
  }

  _getTitle (props) {
    const { title, titleTemplate = '%s', defaultTitle } = { ...rewind(), ...props }
    return titleTemplate.replace('%s', title || defaultTitle || '')
  }

  _getMeta ({ meta = [] }) {
    return meta.map(({ name, property, content }) =>
      <meta
        name={name}
        property={property}
        content={content}
        data-helmet
      />
    )
  }

  render () {
    return (
      <Wrapper>
        <title data-helmet='true'>{this._getTitle(this.props)}</title>
        {this._getMeta(this.props)}
      </Wrapper>
    )
  }
}
