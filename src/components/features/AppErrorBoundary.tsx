import { Component,type ReactNode } from 'react';
interface Props{children:ReactNode;}
interface State{failed:boolean;}
export default class AppErrorBoundary extends Component<Props,State>{state:State={failed:false};static getDerivedStateFromError(){return {failed:true};}componentDidCatch(error:Error){console.error('Starfighters interface error:',error.message);}render(){return this.state.failed?<main className="min-h-screen flex items-center justify-center p-8"><section className="panel max-w-lg"><h1 className="text-2xl font-semibold">This corner needs a moment.</h1><p className="text-muted-foreground mt-4">The page could not be displayed. Return to the homepage and try again.</p><a href="/" className="btn-secondary mt-6">Return home</a></section></main>:this.props.children;}}
