import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from '../../shared/ui/Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'large' | 'big'
}

export function Modal({ isOpen, onClose, title, children, size='large' }: ModalProps) {
    const sizes = {
        large: 'max-w-lg',
        big: 'max-w-6xl'
    }

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className={`mx-auto ${sizes[size]} w-full max-h-screen rounded-lg bg-white shadow-xl`}>
                    <div className="flex items-center justify-between border-b p-4">
                        <Dialog.Title className="text-lg font-semibold">
                            {title}
                        </Dialog.Title>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="p-4">
                        {children}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}