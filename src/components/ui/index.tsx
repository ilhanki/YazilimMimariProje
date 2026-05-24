import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Check, ChevronDown, ChevronRight, CircleAlert, CircleCheck, CircleX, Loader2, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { createContext, createElement, useContext, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';

export { cn } from '../../lib/utils';

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'glass';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}) {
  const Comp = asChild ? 'span' : 'button';

  return createElement(Comp, {
    className: cn(
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50',
      variant === 'default' && 'bg-gradient-to-r from-indigo-500 to-violet-500 text-on-accent shadow-[0_10px_30px_rgba(99,102,241,0.28)] hover:brightness-110',
      variant === 'secondary' && 'bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--glass)]',
      variant === 'ghost' && 'bg-transparent text-[var(--foreground)] hover:bg-[var(--glass)]',
      variant === 'outline' && 'border border-white/10 bg-transparent text-[var(--foreground)] hover:bg-[var(--glass)]',
      variant === 'destructive' && 'bg-rose-500/20 text-on-accent hover:bg-rose-500/30',
      variant === 'glass' && 'border border-white/10 bg-[var(--glass)] text-[var(--foreground)] backdrop-blur-xl hover:bg-[var(--surface)]',
      size === 'default' && 'h-10 px-4 py-2',
      size === 'sm' && 'h-9 rounded-xl px-3 text-xs',
      size === 'lg' && 'h-12 rounded-2xl px-6 text-base',
      size === 'icon' && 'h-10 w-10 rounded-2xl',
      className,
    ),
    ...props,
  });
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-[28px] border border-white/10 bg-[var(--card)] shadow-glow backdrop-blur-xl', className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold tracking-tight text-[var(--foreground)]', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-[var(--muted)]', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 pb-6', className)} {...props} />;
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'muted';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide',
        variant === 'default' && 'bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400/20',
        variant === 'secondary' && 'bg-[var(--surface)] text-[var(--foreground)] ring-1 ring-inset ring-[var(--border)]',
        variant === 'outline' && 'border border-white/10 text-[var(--foreground)]',
        variant === 'success' && 'bg-emerald-500/20 text-emerald-200 ring-1 ring-inset ring-emerald-400/20',
        variant === 'warning' && 'bg-amber-500/20 text-amber-200 ring-1 ring-inset ring-amber-400/20',
        variant === 'muted' && 'bg-slate-500/20 text-slate-200 ring-1 ring-inset ring-slate-400/20',
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-2 text-sm text-[var(--foreground)] placeholder:text-slate-400 shadow-inner outline-none transition focus:border-indigo-400/40 focus:bg-white/8 focus:ring-2 focus:ring-indigo-500/15',
        className,
      )}
      {...props}
    />
  );
}

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <SeparatorPrimitive.Root className={cn('shrink-0 bg-white/10', className)} {...props} />;
}

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-white/10 bg-white/10 shadow-inner transition-colors data-[state=checked]:bg-indigo-500/80',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow-lg transition-transform data-[state=checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  );
}

export function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return <AvatarPrimitive.Root className={cn('relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/10', className)} {...props} />;
}

export function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cn('h-full w-full object-cover', className)} {...props} />;
}

export function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return <AvatarPrimitive.Fallback className={cn('flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white', className)} {...props} />;
}

export function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

export function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

export function DialogContent({ className, children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return createPortal(
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/72 backdrop-blur-sm data-[state=open]:animate-[fadeIn_180ms_ease-out]" />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[min(92vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-[30px] border border-white/10 bg-[var(--card)] p-0 shadow-[0_30px_80px_rgba(2,6,23,0.55)] outline-none data-[state=open]:animate-[scaleIn_180ms_ease-out]',
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>,
    document.body,
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-start justify-between gap-4 border-b border-white/10 p-6', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn('text-lg font-semibold text-[var(--foreground)]', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn('text-sm text-slate-300/80', className)} {...props} />;
}

export function DialogClose({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close className={cn('rounded-full p-2 text-slate-400 transition hover:bg-white/8 hover:text-white', className)} {...props} />;
}

export function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4 p-6', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col-reverse gap-3 border-t border-white/10 p-6 sm:flex-row sm:justify-end', className)} {...props} />;
}

export function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root {...props} />;
}

export function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger {...props} />;
}

export function DropdownMenuContent({ className, sideOffset = 10, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn('z-50 min-w-52 overflow-hidden rounded-2xl border border-white/10 bg-[var(--card)] p-1.5 shadow-[0_20px_50px_rgba(2,6,23,0.5)] backdrop-blur-xl', className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'relative flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-100 outline-none transition hover:bg-white/8 focus:bg-white/8 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) {
  return <DropdownMenuPrimitive.Label className={cn('px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-400', inset && 'pl-8', className)} {...props} />;
}

export function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator className={cn('my-1 h-px bg-white/10', className)} {...props} />;
}

export function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger className={cn('flex h-10 w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 text-sm text-slate-100 shadow-inner outline-none transition hover:bg-white/8 focus:ring-2 focus:ring-indigo-500/15', className)} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn('z-50 overflow-hidden rounded-2xl border border-white/10 bg-[var(--card)] shadow-[0_20px_50px_rgba(2,6,23,0.5)] backdrop-blur-xl', className)} {...props}>
        <SelectPrimitive.Viewport className="p-1.5" />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item className={cn('relative flex cursor-pointer select-none items-center rounded-xl py-2.5 pl-9 pr-8 text-sm text-slate-100 outline-none transition hover:bg-white/8 focus:bg-white/8', className)} {...props}>
      <span className="absolute left-3.5 flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4 text-indigo-300" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText />
    </SelectPrimitive.Item>
  );
}

export function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}

const ToastContext = createContext<{
  pushToast: (options: ToastOptions) => void;
}>({
  pushToast: () => undefined,
});

let toastCounter = 0;

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}

interface ToastEntry extends ToastOptions {
  id: number;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const pushToast = (options: ToastOptions) => {
    const id = ++toastCounter;
    setToasts((current) => [...current, { id, ...options }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3400);
  };

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[80] flex w-[min(92vw,360px)] flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                'flex items-start gap-3 rounded-3xl border border-white/10 bg-[var(--card)] px-4 py-3 shadow-[0_18px_40px_rgba(2,6,23,0.45)] backdrop-blur-xl',
                toast.variant === 'success' && 'ring-1 ring-emerald-400/20',
                toast.variant === 'warning' && 'ring-1 ring-amber-400/20',
                toast.variant === 'destructive' && 'ring-1 ring-rose-400/20',
              )}
            >
              <div className={cn('mt-0.5 rounded-full p-1.5', toast.variant === 'success' && 'bg-emerald-500/20 text-emerald-300', toast.variant === 'warning' && 'bg-amber-500/20 text-amber-300', toast.variant === 'destructive' && 'bg-rose-500/20 text-rose-300', !toast.variant && 'bg-indigo-500/20 text-indigo-300')}>
                {toast.variant === 'success' && <CircleCheck className="h-4 w-4" />}
                {toast.variant === 'warning' && <CircleAlert className="h-4 w-4" />}
                {toast.variant === 'destructive' && <CircleX className="h-4 w-4" />}
                {!toast.variant && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--foreground)]">{toast.title}</p>
                {toast.description ? <p className="mt-0.5 text-xs leading-5 text-slate-400">{toast.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => setToasts((current) => current.filter((entry) => entry.id !== toast.id))}
                className="rounded-full p-1 text-slate-400 transition hover:bg-white/8 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent', className)} />;
}

export function MenuIcon({ className }: { className?: string }) {
  return <ChevronRight className={cn('h-4 w-4', className)} />;
}
