import './Button.css'

export default function Button({active = true, variant = 'solid', fullWidth, children, ...rest}){

    const state = (active ? variant: 'disabled');

    const classes = `btn btn-${state} ${fullWidth ? 'btn-full':''}`.trim();

    return (
        <button className={classes} {...rest}>
            {children}
        </button>
    )
}