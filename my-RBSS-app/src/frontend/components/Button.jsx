import './Button.css'

export default function Button({variant = 'solid', fullWidth, children, ...rest}){

    const classes = `btn btn-${variant} ${fullWidth ? 'btn-full':''}`

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    )
}